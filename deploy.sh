#!/bin/bash

# Diretório onde o Vite cria a build
BUILD_DIR="dist"

# Caminho do seu servidor
USER="root"
SERVER_IP="168.231.94.119"
SERVER_PATH="/var/www/cardeneta.com"

# Verificar se o build foi concluído com sucesso

    # Copiar os arquivos gerados para o servidor com SCP
    echo "Enviando arquivos para o servidor..."
    scp -r $BUILD_DIR/* $USER@$SERVER_IP:$SERVER_PATH

    # Conecta no servidor e recarrega o nginx
ssh $USER@$SERVER_IP "systemctl reload nginx.service"

    

    if [ $? -eq 0 ]; then
        echo "Arquivos enviados com sucesso!"
    else
        echo "Erro ao enviar arquivos para o servidor."
    fi

