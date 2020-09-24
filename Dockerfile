FROM node:10-alpine

ARG LESS_FILE_NAME
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


COPY . .
#RUN cat ./static/less/_variables.less

ARG LESS_FILE_NAME_SOURCE_ARG=$LESS_FILE_NAME
#RUN echo "fileName ${LESS_FILE_NAME}"
#ARG LESS_FILE_NAME_SOURCE_ARG=static/less/s3_envs/variables-stg.less
COPY ${LESS_FILE_NAME_SOURCE_ARG} ./static/less/_variables.less
#RUN ls static/less
#RUN cat ./static/less/_variables.less


COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ./
RUN npm run build
CMD ["npm", "run","start"]
EXPOSE ${PORT}
