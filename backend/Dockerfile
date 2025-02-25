# an official lightweight Python image
FROM python:3.10-slim

# set the working directpru on the container
WORKDIR /app

# copy only requirements first for Docker caching
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy rest of application
COPY . .

# expose the port FastAPI runs on
EXPOSE 8080

# run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]