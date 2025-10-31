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
    temp_dir = None
    
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
        
        lang = server.get("lang")
        entrypoint = server.get("entrypoint")
        repository = server.get("repository", {})
        repo_url = repository.get("url") if isinstance(repository, dict) else repository
        
        if not all([lang, entrypoint, repo_url]):
            raise HTTPException(
                status_code=400, 
                detail="Server configuration incomplete (missing lang, entrypoint, or repository)"
            )
        
        temp_dir = tempfile.mkdtemp(prefix=f"mcp_{server_name}_")
        
        try:
            Repo.clone_from(repo_url, temp_dir)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to clone repository: {str(e)}")
        
        entrypoint_path = os.path.join(temp_dir, entrypoint)
        
        if not os.path.exists(entrypoint_path):
            raise HTTPException(
                status_code=500, 
                detail=f"Entrypoint '{entrypoint}' not found in repository"
            )
        
        if lang.lower() == "python":
            cmd = ["python3", entrypoint_path]
        elif lang.lower() in ["javascript", "typescript", "node", "nodejs"]:
            cmd = ["node", entrypoint_path]
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported language: {lang}"
            )
        
        try:
            result = subprocess.run(
                cmd,
                cwd=temp_dir,
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
    finally:
        if temp_dir and os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                print(f"Warning: Failed to cleanup temp directory {temp_dir}: {e}")

