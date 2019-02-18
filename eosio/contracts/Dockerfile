FROM ubuntu:18.04

# needed for install script
ENV TERM dumb

RUN  apt-get update \
  && apt-get install -y wget \
  git \
  python3-pip python3-dev build-essential

RUN wget https://github.com/EOSIO/eos/releases/download/v1.5.5/eosio_1.5.5-1-ubuntu-18.04_amd64.deb
RUN apt-get install -y ./eosio_1.5.5-1-ubuntu-18.04_amd64.deb

RUN wget https://github.com/EOSIO/eosio.cdt/releases/download/v1.5.0/eosio.cdt_1.5.0-1_amd64.deb
RUN apt-get install -y ./eosio.cdt_1.5.0-1_amd64.deb

RUN wget -qO- "https://cmake.org/files/v3.13/cmake-3.13.4-Linux-x86_64.tar.gz" | tar --strip-components=1 -xz -C /usr/local

WORKDIR /home
RUN mkdir contracts

WORKDIR /
COPY eosfactory /eosfactory
WORKDIR /eosfactory
RUN echo "{ \"EOSIO_CONTRACT_WORKSPACE\": \"/home/contracts\"}" > config.json
RUN echo | ./install.sh

RUN pip3 install typing_extensions

WORKDIR /home/contracts

