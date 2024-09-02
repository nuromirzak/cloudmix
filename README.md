# Readme

## How to run?

1. Deploy RDS instance with the following command in `cdk` directory:
```bash
npm install
cdk bootstrap
cdk deploy
```

2. Run the following command in `backend` directory:
```bash
fly launch
```

## Required environment variables

- `DB_URL`: URL of the RDS instance
- `DB_USERNAME`: Username of the RDS instance
- `DB_PASSWORD`: Password of the RDS instance
- `SPRING_AI_OPENAI_API_KEY`: OpenAI API key
