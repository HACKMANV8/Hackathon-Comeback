import os
import json
import boto3
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.models import Repository
from pydantic import BaseModel
from typing import Optional

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


class Pricing(BaseModel):
    currency: str
    amount: float


class CreateServerRequest(BaseModel):
    name: str
    version: str = "1.0.0"
    description: str
    author: str
    lang: str
    license: str
    entrypoint: str
    repository: Repository
    pricing: Pricing
    tools: Optional[dict] = None
    sonarqube: Optional[dict] = None


@router.get("/servers/{server_name}")
async def get_server_info(server_name: str):
    """Get detailed information about a specific MCP server"""
    try:
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptions.NoSuchKey:
            raise HTTPException(status_code=404, detail="MCP servers database not found")
        
        servers = file_data.get("servers", [])
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
            return JSONResponse(content={"total": 0, "servers": []})
        
        servers = file_data.get("servers", [])
        
        # Return full server data including pricing
        server_list = []
        for server in servers:
            server_info = {
                "name": server.get("name"),
                "version": server.get("version"),
                "description": server.get("description"),
                "author": server.get("author"),
                "lang": server.get("lang"),
                "license": server.get("license"),
                "entrypoint": server.get("entrypoint"),
                "repository": server.get("repository"),
            }
            
            # Add tools if exists
            if "tools" in server and server["tools"]:
                server_info["tools"] = server["tools"]
            
            # Add pricing (always include, or default to free)
            if "pricing" in server and server["pricing"]:
                server_info["pricing"] = server["pricing"]
            else:
                # Default to free if pricing not specified (for legacy servers)
                server_info["pricing"] = {"currency": "", "amount": 0}
            
            # Add sonarqube if exists (legacy support)
            if "sonarqube" in server and server["sonarqube"]:
                server_info["sonarqube"] = server["sonarqube"]
            
            # Add security_report if exists (new format)
            if "security_report" in server and server["security_report"]:
                server_info["security_report"] = server["security_report"]
            
            server_list.append(server_info)
        
        return JSONResponse(content={
            "total": len(server_list),
            "servers": server_list
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching servers: {str(e)}")


@router.post("/servers")
async def create_server(server: CreateServerRequest):
    """Create a new MCP server and add it to S3"""
    try:
        # Get existing data from S3
        try:
            response = s3_client.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
            file_data = json.loads(response['Body'].read().decode('utf-8'))
        except s3_client.exceptions.NoSuchKey:
            # If file doesn't exist, create new structure
            file_data = {"servers": []}
        
        # Check if server with same name already exists
        servers = file_data.get("servers", [])
        if any(s["name"] == server.name for s in servers):
            raise HTTPException(status_code=400, detail=f"Server '{server.name}' already exists")
        
        # Create new server object
        new_server = {
            "name": server.name,
            "version": server.version,
            "description": server.description,
            "author": server.author,
            "lang": server.lang,
            "license": server.license,
            "entrypoint": server.entrypoint,
            "repository": {
                "type": server.repository.type,
                "url": server.repository.url
            },
            "meta": {
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
        
        # Add pricing (required field)
        new_server["pricing"] = {
            "currency": server.pricing.currency,
            "amount": server.pricing.amount
        }
        
        if server.tools:
            new_server["tools"] = server.tools
        
        if server.sonarqube:
            new_server["sonarqube"] = server.sonarqube
        
        # Add to servers list
        servers.append(new_server)
        file_data["servers"] = servers
        
        # Upload updated data to S3
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=S3_KEY,
            Body=json.dumps(file_data, indent=2),
            ContentType='application/json'
        )
        
        return JSONResponse(
            content={
                "message": "Server created successfully",
                "server": new_server
            },
            status_code=201
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating server: {str(e)}")


