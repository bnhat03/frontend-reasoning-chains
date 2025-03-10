import os
import google.generativeai as genai
from services.auth import verify_jwt
import chainlit as cl
from db import users_collection, conversations_collection
from bson import ObjectId
import jwt
from config import INSTRUCTION_PROMPT
import json
from datetime import datetime

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

settings = {
    "model": "gemini-2.0-flash",
    "temperature": 0.7,
    "max_output_tokens": 500,
}
newchat = False
model = genai.GenerativeModel(settings["model"])

@cl.on_chat_start
async def on_chat_start():
    user_env = cl.user_session.get("env")
    if isinstance(user_env, str):
        user_env = json.loads(user_env)

    token = user_env["Authorization"].replace("Bearer ", "")
    try:
        user_id = verify_jwt(token)
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            current_user = cl.User(identifier=user["email"], metadata={"user_id": str(user["_id"]), "role": "user"})
            cl.user_session.set("identifier", current_user.identifier)
            cl.user_session.set("metadata", current_user.metadata)
            cl.context.session.user = current_user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, KeyError):
        return None
        
    if not user:
        return  
    cl.user_session.set("message_history", [])

@cl.on_message
async def on_message(message: cl.Message):
    selected_conversation_id = message.metadata.get("conversation_id")
    current_conversation_id = cl.user_session.get("conversation_id")
    message_history = cl.user_session.get("message_history")
    # If user create another conversation

    print("message.content: >>>>>>>>>>>>>", message.content)
    if selected_conversation_id and selected_conversation_id != current_conversation_id:
        cl.user_session.set("conversation_id", selected_conversation_id)
        existing_conversation = conversations_collection.find_one({"_id": ObjectId(selected_conversation_id)})
        if existing_conversation:
            db_messages = existing_conversation["messages"]
            converted_history = []
            for msg in db_messages:
                converted_msg = {
                    "role": msg["role"],
                    "parts": [{"text": msg["text"]}]
                }
                converted_history.append(converted_msg)
            message_history = converted_history
            cl.user_session.set("message_history", message_history)
        else:
            message_history = []
            cl.user_session.set("message_history", message_history)

    # if not cl.user_session.get("conversation_id"):
    if not message.metadata.get("conversation_id"):
        print("Ko có conversation_id: >>>>>>>>>>>>>")
        metadata = cl.user_session.get("metadata")
        user_id = metadata["user_id"]
        conversation = {"user_id": user_id, "messages": []}
        conversation_id = str(conversations_collection.insert_one(conversation).inserted_id)
        cl.user_session.set("conversation_id", conversation_id)
        message_history = []
        cl.user_session.set("message_history", message_history)
    current_time = datetime.now().isoformat()
    # Original user message for storage
    original_user_message = {
        "role": "user",
        "parts": [{"text": message.content}]
    }
    # Add instruction prompt to user message for LLM
    prompted_message_content = f"{INSTRUCTION_PROMPT}\n{message.content}"
    
    # Store the original message in history
    message_history.append(original_user_message)

    # Start Gemini Chat but send the prompted message
    convo = model.start_chat(history=message_history)
    response = convo.send_message(prompted_message_content)

    # Model
    model_user =  message.metadata.get("model_id")
    print("model user chọn: >>>>>>>>>>>>>>>>>>", model_user)
    if (model_user == "1" or model_user == "2"):
        # Sending message to the front
        msg = cl.Message(content=response.text)
        msg.metadata = {
            "conversation_id": str(cl.user_session.get("conversation_id")),
            "result": "single"
        }    
        await msg.send()
    elif (model_user == "both"):
        # Sending message to the front
        msg = cl.Message(content=f"🔹 **Model 1:** {response.text} \n => Model 1\n\n🔹 **Model 2:** {response.text} => Model 2")
        msg.metadata = {
            "conversation_id": str(cl.user_session.get("conversation_id")),
            "result": "double"
        }    
        await msg.send()

    assistant_message = {
        "role": "assistant",
        "parts": [{"text": response.text}]
    } 
    message_history.append(assistant_message)

    # user
    conversations_collection.update_one(
        {"_id": ObjectId(cl.user_session.get("conversation_id"))},
        {
            "$push": {
                "messages": {
                    "role": "user",
                    "text": message.content,
                    "timestamp": current_time
                }
            }
        }
    )
    
    if (model_user == "1" or model_user == "2"):
        # assistant
        conversations_collection.update_one(
            {"_id": ObjectId(cl.user_session.get("conversation_id"))},
            {
                "$push": {
                    "messages": {
                        "role": "assistant",
                        "text": f"Single: {response.text}",
                        "timestamp": current_time
                    }
                }
            }
        )
    elif (model_user == "both"):
        conversations_collection.update_one(
            {"_id": ObjectId(cl.user_session.get("conversation_id"))},
            {
                "$push": {
                    "messages": {
                        "role": "assistant",
                        "text": f"Double: 🔹 **Model 1:** {response.text} \n => Model 1\n\n🔹 **Model 2:** {response.text} => Model 2",
                        "timestamp": current_time
                    }
                }
            }
        )