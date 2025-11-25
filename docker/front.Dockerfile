ARG REDOS_DOCKER_REGISTRY
# Use the base NodeJS image as the starting point
ARG NODEJS_BASE_IMAGE
# Use the base NodeJS image as the runtime point
ARG NGINX_BASE_IMAGE

FROM $REDOS_DOCKER_REGISTRY/$NODEJS_BASE_IMAGE AS node

# 0
USER root

ARG LANDSCAPE
COPY ./ci/devzone-tools/certs/ /etc/pki/ca-trust/source/anchors
RUN if [ "$LANDSCAPE" = "devzone" ] ; then \
        update-ca-trust \
        && ls -al /etc/pki/ca-trust/source/anchors/ \
        && ls -al /etc/pki/tls/certs/; \
    elif [ "$LANDSCAPE" = "trust" ] ; then \
        curl -k https://nexus.gazprom-neft.local:443/repository/local-repo/CA/root-ca-gazprom-neft.pem --output /etc/pki/ca-trust/source/anchors/root-ca-gazprom-neft.pem \
        && curl -k https://nexus.gazprom-neft.local:443/repository/local-repo/CA/sub-ca.pem --output /etc/pki/ca-trust/source/anchors/sub-ca.pem \
        && openssl x509 -in /etc/pki/ca-trust/source/anchors/root-ca-gazprom-neft.pem -text -noout \
        && openssl x509 -in /etc/pki/ca-trust/source/anchors/sub-ca.pem -text -noout \
        && update-ca-trust; \
    else \
        echo "Unknown LANDSCAPE. Skipping cert ..."; \
    fi

COPY --chown=1001 package*.json vite.config.ts index.html tsconfig.json global.d.ts ./
COPY --chown=1001 src ./src
COPY --chown=1001 public ./public

ARG NPM_REGISTRY
RUN npm update -g npm --registry=${NPM_REGISTRY} && npm ci --registry=${NPM_REGISTRY} --force;

RUN npm run build

FROM $REDOS_DOCKER_REGISTRY/$NGINX_BASE_IMAGE AS runtime

# root
USER root

# Копирует бандл из промежуточного лейера
COPY --chown=1001:0 --from=node /opt/app-root/src/build/ /opt/app-root/src/

# Удаляем лишних пользователей
RUN userdel -f nginx && userdel -f mail && userdel -f sync && userdel -f games && userdel -f ftp
# Удаляем все что предоставляется из коробки
RUN rm -rf /etc/nginx/ && rm -rf /usr/lib64/nginx/ && rm -rf /usr/share/nginx/ && rm -rf /var/www/html/nginx/
# Uninstall system deps (for luntry)
RUN dnf remove -y --skip-broken python3-urllib3 python3-urllib3+socks python3-setuptools python3-pip python3-six \
    nodejs-npm nodejs nodejs-full-i18n nodejs-libs nodejs-docs

# Зарезаем права директории nginx до минимальных. Чтение и запись доступны только воадельцу.
RUN mkdir /etc/nginx/ && chown -R 1001:0 /etc/nginx/ 

# Создаем pid и даем минимальные полномочия
RUN mkdir -p /var/run/nginx/ && touch /var/run/nginx/nginx.pid && chown 1001:0 /var/run/nginx/nginx.pid && chmod 644 /var/run/nginx/nginx.pid

# non root
USER 1001

EXPOSE 8080

CMD exec nginx -g 'daemon off;'
