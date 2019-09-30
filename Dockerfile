FROM node:10-alpine

ENV FC_LANG en-US
ENV LC_CTYPE en_US.UTF-8
ARG NODE_ENV=dev
ARG PORT=6310
ENV NODE_ENV=${NODE_ENV} 
ENV PORT=${PORT}

# dependencies
RUN apk --no-cache add --update bash ttf-dejavu fontconfig curl wget git

# install chamber
ARG CHAMBER_AWS_REGION
ENV CHAMBER_AWS_REGION ${CHAMBER_AWS_REGION:-us-east-1}

ENV CHAMBER_VERSION=2.5.0
RUN curl -sLo chamber https://github.com/segmentio/chamber/releases/download/v${CHAMBER_VERSION}/chamber-v${CHAMBER_VERSION}-linux-amd64 && \
    chmod +x chamber && \
    mv chamber /usr/local/bin/chamber

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ./
COPY . .
RUN npm run build
CMD ["npm", "run","start"]
EXPOSE ${PORT}
