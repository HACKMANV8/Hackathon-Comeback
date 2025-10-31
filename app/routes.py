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
    clone_dir = None
    
    try:
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptiosns.NoSuchKey:
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

