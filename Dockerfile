FROM node:10-alpine

ARG NODE_ENV=dev
ARG PORT=6310
ENV NODE_ENV=${NODE_ENV} 
ENV PORT=${PORT}


# dependencies
RUN apk --no-cache add --update bash ttf-dejavu fontconfig curl wget git

# install chamber
ARG CHAMBER_AWS_REGION
ENV CHAMBER_AWS_REGION ${CHAMBER_AWS_REGION:-us-east-1}

ENV CHAMBER_VERSION=2.3.3
RUN curl -sLo chamber https://github.com/segmentio/chamber/releases/download/v${CHAMBER_VERSION}/chamber-v${CHAMBER_VERSION}-linux-amd64 && \
    chmod +x chamber && \
    mv chamber /usr/local/bin/chamber

WORKDIR /app
COPY package.json /app
RUN npm install

COPY . /app
ENTRYPOINT ["node", "server.js"]
EXPOSE ${PORT}