import os
import razorpay
import hmac
import hashlib
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

payment_router = APIRouter(prefix="/api/v1/payment")

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
)


class CreateOrderRequest(BaseModel):
    server_name: str
    amount: float
    currency: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    server_name: str


@payment_router.post("/create-order")
async def create_order(request: CreateOrderRequest):
    """Create a Razorpay order for server purchase"""
    try:
        # Convert amount to smallest currency unit (paise for INR, cents for USD, etc.)
        amount_in_subunits = int(request.amount * 100)
        
        # Razorpay requires currency in uppercase
        currency_upper = request.currency.upper()
        
        order_data = {
            "amount": amount_in_subunits,
            "currency": currency_upper,
            "receipt": f"order_{request.server_name}_{amount_in_subunits}",
            "notes": {
                "server_name": request.server_name
            }
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        return JSONResponse(content={
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": os.getenv("RAZORPAY_KEY_ID")
        })
        
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request to Razorpay: {str(e)}")
    except razorpay.errors.ServerError as e:
        raise HTTPException(status_code=502, detail=f"Razorpay server error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")


@payment_router.post("/verify-payment")
async def verify_payment(request: VerifyPaymentRequest):
    """Verify Razorpay payment signature"""
    try:
        # Verify signature
        generated_signature = hmac.new(
            os.getenv("RAZORPAY_KEY_SECRET").encode(),
            f"{request.razorpay_order_id}|{request.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == request.razorpay_signature:
            # Payment is valid
            # Here you can:
            # 1. Update database with payment status
            # 2. Grant access to the server
            # 3. Send confirmation email
            
            return JSONResponse(content={
                "status": "success",
                "message": "Payment verified successfully",
                "payment_id": request.razorpay_payment_id,
                "server_name": request.server_name
            })
        else:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying payment: {str(e)}")


@payment_router.get("/payment-status/{payment_id}")
async def get_payment_status(payment_id: str):
    """Get payment status from Razorpay"""
    try:
        payment = razorpay_client.payment.fetch(payment_id)
        
        return JSONResponse(content={
            "payment_id": payment["id"],
            "status": payment["status"],
            "amount": payment["amount"],
            "currency": payment["currency"],
            "method": payment.get("method"),
            "email": payment.get("email"),
            "contact": payment.get("contact")
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching payment status: {str(e)}")

