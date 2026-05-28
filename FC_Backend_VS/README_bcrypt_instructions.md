Instruções para ativar hashing de senha (bcryptjs)

O projeto já contém um controlador alternativo que usa bcryptjs:

- `src/controllers/usuarioController.bcrypt.js`

Para ativar em produção / local, siga estes passos:

1) Instale a dependência `bcryptjs` no backend:

```bash
cd FC_Backend
npm install bcryptjs --save
```

2) Substitua o controlador atual pelo novo (duas opções):

- Opção manual (recomendado): renomeie ou remova `src/controllers/usuarioController.js` e renomeie `usuarioController.bcrypt.js` para `usuarioController.js`:

```bash
cd FC_Backend/src/controllers
mv usuarioController.js usuarioController.old.js
mv usuarioController.bcrypt.js usuarioController.js
```

- Ou edite `src/routes/usuarioRoutes.js` para importar o novo arquivo:

```js
// antes
import UsuarioController from '../controllers/usuarioController.js';

// depois
import UsuarioController from '../controllers/usuarioController.bcrypt.js';
```

3) (Opcional) Atualize `package.json` adicionando `bcryptjs` nas dependências e execute `npm install`.

4) Reinicie o backend:

```bash
npm run dev
```

Observações:
- O novo controlador realiza hash das senhas ao criar/atualizar usuários e verifica a senha com `bcrypt.compare` no login.
- Os endpoints permanecem os mesmos; certifique-se de instalar a dependência para evitar erro de importação.
- Se preferir usar o pacote `bcrypt` nativo, instale `bcrypt` em vez de `bcryptjs`, mas o `bcrypt` costuma exigir compilação nativa em alguns ambientes.
