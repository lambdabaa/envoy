# Envoy development environment
FROM ubuntu

RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update

RUN apt-get install -y python-software-properties
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-add-repository ppa:webupd8team/java -y
RUN apt-get update

# Accept oracle license thing fml...
RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections

# Global dependencies
RUN apt-get install -y \
  curl \
  firefox \
  git \
  mongodb \
  nodejs \
  oracle-java7-installer \
  xvfb

# I kid you not... see http://stackoverflow.com/questions/17243032/curl-ca-cert-error-installing-meteor-on-mac
RUN curl https://install.meteor.com/ > meteor.sh
RUN sed -i 's/https/http/' meteor.sh
RUN sh meteor.sh

# Local dependencies
# Note that according to http://docs.docker.io/en/latest/reference/builder/#add, we need a trailing slash here :)
ADD . /envoy/
RUN cd /envoy && npm install
RUN cd /envoy/app && /envoy/node_modules/.bin/mrt install
RUN chown -R 700 /envoy

# Meteor
EXPOSE 3000
# Mongo
EXPOSE 3001
# Selenium
EXPOSE 4444
# Istanbul
EXPOSE 8080
