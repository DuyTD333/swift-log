docker run -it -d \
    --name expo-app \
   -v $(pwd):/app \
   -w /app \
   -p 19000:19000 \
   -p 19001:19001 \
   -p 8081:8081 \
   node:20 \
   sh -c "npm install && npx expo start --tunnel"
