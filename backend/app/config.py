import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret_key')
    
    # Supabase PostgreSQL connection URL
    # Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///vendorbridge.db')
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_dev_secret')
    JWT_ACCESS_TOKEN_EXPIRES = 3600 * 24  # 24 hours
    
    # Supabase credentials
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    
    # Email (Resend)
    RESEND_API_KEY = os.getenv('RESEND_API_KEY')
    FROM_EMAIL = os.getenv('FROM_EMAIL', 'VendorBridge <noreply@vendorbridge.com>')
    
    # AI
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    
    # n8n Automation webhooks
    N8N_WEBHOOK_BASE_URL = os.getenv('N8N_WEBHOOK_BASE_URL', 'http://localhost:5678')
    
    # Celery (Redis)
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
