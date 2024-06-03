FROM node:18
# 경로 설정하기
WORKDIR /app

# npm install의 결과로서 생성되는 node_modules의 .bin을 PATH에 추가
ENV PATH /app/node_modules/.bin:$PATH

# package.json 워킹 디렉토리에 복사 (.은 설정한 워킹 디렉토리를 뜻함)
COPY package.json ./
COPY package-lock.json ./


# 명령어 실행 (의존성 설치)
RUN npm install
# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사한다.
COPY . .

ARG ENV
RUN if [ "$ENV" = "DEV" ] ; then \
        cp .env.development .env ; \
    elif [ "$ENV" = "TEST" ] ; then \
        cp .env.test .env ; \
    else \
        cp .env.production .env ; \
    fi

# 각각의 명령어들은 한줄 한줄씩 캐싱되어 실행된다.
# package.json의 내용은 자주 바뀌진 않을 거지만
# 소스 코드는 자주 바뀌는데
# npm install과 COPY . . 를 동시에 수행하면
# 소스 코드가 조금 달라질때도 항상 npm install을 수행해서 리소스가 낭비된다.

# 3000번 포트 노출
#EXPOSE 3000

# npm start 스크립트 실행
# CMD는 ENTRYPOINT여야 함. 매개변수가 정의되는 경우 CMD는 수행되지 않으며
# 따라서, 컨테이너가 수행될 때 필수적으로 실행되는 경우 ENTRYPOINT를 사용해야 한다.
ENTRYPOINT ["npm", "start"]
