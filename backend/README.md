# How to deploy

1. `./gradlew clean build`
2. `docker build -t cloudmix:lastest .`
3. `aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws`
4. `aws ecr-public create-repository --repository-name cloudmix --region us-east-1`
5. `docker tag cloudmix:latest public.ecr.aws/l7j1e1p3/cloudmix:latest`
6. `docker push public.ecr.aws/l7j1e1p3/cloudmix:latest`
