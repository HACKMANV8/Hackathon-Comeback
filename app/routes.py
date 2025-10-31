import os
import json
import boto3
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

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
            
            # Add pricing if exists
            if "pricing" in server and server["pricing"]:
                server_info["pricing"] = server["pricing"]
            
            # Add sonarqube if exists
            if "sonarqube" in server and server["sonarqube"]:
                server_info["sonarqube"] = server["sonarqube"]
            
            server_list.append(server_info)
        
        return JSONResponse(content={
            "total": len(server_list),
            "servers": server_list
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching servers: {str(e)}")


