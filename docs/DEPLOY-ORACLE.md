# Deploy na Oracle Cloud

O jogo pode compartilhar a mesma instância do AlugaXP. Ele não usa banco de
dados e deve ficar acessível apenas pelo proxy HTTPS já instalado no servidor.

## Arquitetura recomendada

```text
Internet -> proxy HTTPS (80/443) -> 127.0.0.1:8081 -> container do jogo
```

Prefira um subdomínio, como `jogo.seudominio.com.br`. O frontend utiliza URLs
absolutas em `/assets`, portanto publicar em uma subpasta exigiria alterações.

## 1. Diagnóstico sem alterações

Após conectar por SSH, execute:

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
docker compose ls
sudo ss -lntp
sudo systemctl status nginx --no-pager || true
sudo systemctl status caddy --no-pager || true
```

Esses comandos identificam portas ocupadas e o proxy utilizado pelo AlugaXP.

## 2. Instalação do jogo

Escolha um diretório próprio e clone o repositório:

```bash
sudo mkdir -p /opt/pato-ao-alvo-web
sudo chown "$USER":"$USER" /opt/pato-ao-alvo-web
git clone https://github.com/lucasalbqq/patoAoAlvo_web.git /opt/pato-ao-alvo-web
cd /opt/pato-ao-alvo-web
docker compose -f compose.prod.yaml up -d --build
```

Confirme a execução:

```bash
docker compose -f compose.prod.yaml ps
curl --fail http://127.0.0.1:8081/api/health.php
```

Não libere a porta 8081 na Oracle Cloud nem no firewall do sistema. Ela está
vinculada ao endereço local do servidor e deve ser acessada pelo proxy.

## 3. Exemplo para Nginx

Troque `jogo.seudominio.com.br` pelo domínio real:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name jogo.seudominio.com.br;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Valide antes de recarregar:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Em seguida, use o mesmo processo do AlugaXP para emitir o certificado HTTPS.

## 4. DNS e rede

Crie um registro DNS `A` para o subdomínio apontando para o IP público da
instância. Na Oracle Cloud, mantenha entrada pública somente para 80/443 e a
regra SSH já utilizada. A porta 8081 não precisa de regra de entrada.

## 5. Atualizações futuras

```bash
cd /opt/pato-ao-alvo-web
git pull --ff-only
docker compose -f compose.prod.yaml up -d --build
docker image prune -f
```

Antes de atualizar, confirme que o repositório local do servidor não possui
alterações com `git status --short`.

## Reversão simples

Para retornar ao commit anterior, identifique o hash desejado e crie uma nova
branch ou tag antes de reconstruir. Evite `git reset --hard` em produção.
