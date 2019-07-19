
FROM node:10.14.2-alpine
ENV FC_LANG en-US
ENV LC_CTYPE en_US.UTF-8
ENV NODE_ENV dev
ENV PORT 8615

# dependencies
RUN apk --no-cache add --update bash ttf-dejavu fontconfig curl wget git

# install chamber
ARG CHAMBER_AWS_REGION
ENV CHAMBER_AWS_REGION ${CHAMBER_AWS_REGION:-us-east-1}

ENV CHAMBER_VERSION=2.2.0
RUN curl -sLo chamber https://github.com/segmentio/chamber/releases/download/v${CHAMBER_VERSION}/chamber-v${CHAMBER_VERSION}-linux-amd64 && \
    chmod +x chamber && \
    mv chamber /usr/local/bin/chamber

WORKDIR /app
COPY package.json /app
RUN npm install

COPY . /app
ENTRYPOINT ["node", "server.js"]
EXPOSE 8615