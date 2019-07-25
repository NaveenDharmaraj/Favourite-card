## Creating a base image for Chimp usage
LABEL maintainer="udaykumar.kr@chimp.net"

FROM node:10.14.2-alpine

ENV NODE_ENV dev
ENV PORT 6310
