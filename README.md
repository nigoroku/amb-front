# ambitious-front

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## ECR image push

```bash
# イメージにタグを設定
$ docker tag <image>:<tag> <aws_account_id>.dkr.ecr.<cn-north-1>.amazonaws.com/<image>:<tag>

# ECRにイメージをプッシュ
$ docker push <aws_account_id>.dkr.ecr.<cn-north-1>.amazonaws.com/<image>:<tag>
```
