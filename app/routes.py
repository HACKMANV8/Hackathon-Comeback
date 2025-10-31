import os
import json
import boto3
import tempfile
import shutil
import subprocess
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
from dotenv import load_dotenv
from git import Repo

load_dotenv()

router = APIRouter(prefix="/api/v1")

S3_BUCKET = os.getenv("S3_BUCKET_NAME")
S3_KEY = "mcp.json"

s3_client = boto3.client(
    's3',
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)


@router.get("/")
async def root():
    return JSONResponse(content={"status": "running", "message": "MCP-Hub Server is running"})


@router.get("/servers/{server_name}")
async def get_server_info(server_name: str):
    """Get detailed information about a specific MCP server"""
    try:
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptions.NoSuchKey:
            raise HTTPException(status_code=404, detail="MCP servers database not found")
        
        servers = file_data.get("mcphub-servers", [])
        server = next((s for s in servers if s["name"] == server_name), None)
        
        if not server:
            raise HTTPException(status_code=404, detail=f"Server '{server_name}' not found")
        
        return JSONResponse(content=server)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching server info: {str(e)}")


@router.get("/servers")
async def list_servers():
    """List all MCP servers from S3 bucket"""
    try:
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptions.NoSuchKey:
            return JSONResponse(content={"mcphub-servers": []})
        
        servers = file_data.get("mcphub-servers", [])
        
        # Return summary info for each server
        server_list = []
        for server in servers:
            server_list.append({
                "name": server.get("name"),
                "version": server.get("version"),
                "description": server.get("description"),
                "author": server.get("author"),
                "lang": server.get("lang"),
                "license": server.get("license")
            })
        
        return JSONResponse(content={
            "total": len(server_list),
            "servers": server_list
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching servers: {str(e)}")


@router.post("/init")
async def init_mcp(request: Request):
    data = await request.json()

    required_keys = ["name", "version", "description", "author", "lang", "license", "entrypoint", "repository"]
    for key in required_keys:
        if key not in data:
            return JSONResponse(content={"error": f"Missing key: {key}"}, status_code=400)

    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
        file_data = json.loads(response['Body'].read().decode('utf-8'))
        
        if "mcphub-servers" not in file_data:
            file_data = {"mcphub-servers": []}
        
        existing_server = next((s for s in file_data["mcphub-servers"] if s["name"] == data["name"]), None)
        
        if existing_server:
            creation_date = existing_server.get("meta", {}).get("created_at", datetime.now(timezone.utc).isoformat())
        else:
            creation_date = datetime.now(timezone.utc).isoformat()
    except s3_client.exceptions.NoSuchKey:
        file_data = {"mcphub-servers": []}
        creation_date = datetime.now(timezone.utc).isoformat()

    data["meta"] = {
        "created_at": creation_date,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    existing_index = next((i for i, s in enumerate(file_data["mcphub-servers"]) if s["name"] == data["name"]), None)
    if existing_index is not None:
        file_data["mcphub-servers"][existing_index] = data
    else:
        file_data["mcphub-servers"].append(data)

    s3_client.put_object(
        Bucket=S3_BUCKET,
        Key=S3_KEY,
        Body=json.dumps(file_data, indent=2),
        ContentType='application/json'
    )

    return JSONResponse(content={"message": "ok"})


@router.get("/pull/{server_name}")
async def pull_server(server_name: str):
    clone_dir = None
    
    try:
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptions.NoSuchKey:
            raise HTTPException(status_code=404, detail="MCP servers database not found")
        
        servers = file_data.get("mcphub-servers", [])
        server = next((s for s in servers if s["name"] == server_name), None)
        
        if not server:
            raise HTTPException(status_code=404, detail=f"Server '{server_name}' not found")
        
        repository = server.get("repository")
        
        # Handle different repository formats
        if repository is None:
            raise HTTPException(
                status_code=400, 
                detail="Server configuration incomplete (missing repository)"
            )
        
        if isinstance(repository, dict):
            repo_url = repository.get("url")
        elif isinstance(repository, str):
            repo_url = repository
        else:
            repo_url = None
        
        if not repo_url or not isinstance(repo_url, str):
            raise HTTPException(
                status_code=400, 
                detail="Server configuration incomplete (invalid or missing repository URL)"
            )
        
        # Create a permanent directory for cloned repositories
        base_clone_dir = os.path.join(os.getcwd(), "cloned_repositories")
        os.makedirs(base_clone_dir, exist_ok=True)
        
        clone_dir = os.path.join(base_clone_dir, server_name)
        
        # If directory already exists, remove it first to get a fresh clone
        if os.path.exists(clone_dir):
            shutil.rmtree(clone_dir)
        
        try:
            Repo.clone_from(repo_url, clone_dir)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to clone repository: {str(e)}")
        
        return JSONResponse(content={
            "message": "Cloned successfully",
            "server_name": server_name,
            "clone_path": clone_dir,
            "repository_url": repo_url
        })
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/run/{server_name}")
async def run_server(server_name: str):
    try:
        # Fetch server configuration from S3
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptions.NoSuchKey:
            raise HTTPException(status_code=404, detail="MCP servers database not found")
        
        servers = file_data.get("mcphub-servers", [])
        server = next((s for s in servers if s["name"] == server_name), None)
        
        if not server:
            raise HTTPException(status_code=404, detail=f"Server '{server_name}' not found")
        
        lang = server.get("lang")
        entrypoint = server.get("entrypoint")
        
        if not all([lang, entrypoint]):
            raise HTTPException(
                status_code=400, 
                detail="Server configuration incomplete (missing lang or entrypoint)"
            )
        
        # Check if the cloned repository exists
        base_clone_dir = os.path.join(os.getcwd(), "cloned_repositories")
        clone_dir = os.path.join(base_clone_dir, server_name)
        
        if not os.path.exists(clone_dir):
            raise HTTPException(
                status_code=404, 
                detail=f"Repository not cloned yet. Please call /pull/{server_name} first"
            )
        
        entrypoint_path = os.path.join(clone_dir, entrypoint)
        
        if not os.path.exists(entrypoint_path):
            raise HTTPException(
                status_code=500, 
                detail=f"Entrypoint '{entrypoint}' not found in cloned repository"
            )
        
        # Determine the command based on language
        if lang.lower() == "python":
            cmd = ["python3", entrypoint_path]
        elif lang.lower() in ["javascript", "typescript", "node", "nodejs"]:
            cmd = ["node", entrypoint_path]
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported language: {lang}"
            )
        
        # Execute the entrypoint
        try:
            result = subprocess.run(
                cmd,
                cwd=clone_dir,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                return JSONResponse(
                    content={
                        "error": "Execution failed",
                        "stderr": result.stderr,
                        "stdout": result.stdout,
                        "return_code": result.returncode
                    },
                    status_code=500
                )
            
            # Try to parse as JSON, otherwise return as plain text
            try:
                output_json = json.loads(result.stdout)
                return JSONResponse(content=output_json)
            except json.JSONDecodeError:
                response_data = {
                    "output": result.stdout.strip()
                }
                if result.stderr and result.stderr.strip():
                    response_data["stderr"] = result.stderr.strip()
                return JSONResponse(content=response_data)
                
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail="Execution timeout (30s)")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


