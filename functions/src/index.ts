import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

export const deletarUsuarios = functions.database
  .ref("admin/sistema/deletar_usuarios")
  .onUpdate((snapshot, context) => {
    if (snapshot.after.val() === "deletar") {
      deletarUsuariosAuth();
    }
    return true;
  });

function deletarUsuariosAuth() {
  admin
    .auth()
    .listUsers()
    .then(result => {
      for (const user of result.users) {
        admin
          .auth()
          .deleteUser(user.uid)
          .catch(err => console.error(user.uid, err));
      }
    })
    .catch(err => console.error("listUsers", err));
}

export const desnormalizarMensagens = functions.database
  .ref("mensagens/{key}")
  .onCreate((snapshot, context) => {
    const mensagem = snapshot.val();
    const key = snapshot.key;
    const root = snapshot.ref?.parent?.parent
      ? snapshot.ref.parent.parent
      : undefined;

    if (mensagem.urlImagem) {
      gravarMensagensComSemImagem(key, mensagem, "mensagens_com_imagem", root);
    } else {
      gravarMensagensComSemImagem(key, mensagem, "mensagens_sem_imagem", root);
    }
    gravarMensagensPorProvedor(key, mensagem);
    // habilitarForm(mensagem.mensagem);
    return true;
  });

function gravarMensagensComSemImagem(
  key: string,
  mensagem: any,
  tipo: string,
  ref?: admin.database.Reference
) {
  if (ref) {
    ref
      .child(tipo)
      .child(key)
      .set(mensagem)
      .catch(err => console.error(tipo, err));
  }
}

function gravarMensagensPorProvedor(key: string, mensagem: any) {
  admin
    .app()
    .database()
    .ref("usuarios")
    .child(mensagem.uid)
    .once("value", ref => {
      const provider = (ref.val().providerId as string).replace(".", "_");
      admin
        .app()
        .database()
        .ref("mensagens_provider_" + provider)
        .child(key)
        .set(mensagem)
        .catch(err => console.error("mensagens_provider_" + provider, err));
    })
    .catch(err => console.error("gravarMensagensPorProvedor", err));
}

export const addMensagem = functions.https.onRequest((request, response) => {
  const msg = {
    mensagem: request.query.mensagem,
    time: new Date().getTime(),
    uid: "addmensagem",
    nome: "Cloud Function",
    foto:
      "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/google-cloud-functions.png",
    urlImagem: request.query.url ? request.query.url : null
  };
  adicionarMensagem(msg);

  response.send(msg);
});

function adicionarMensagem(mensagem: any) {
  admin
    .app()
    .database()
    .ref("mensagens")
    .push(mensagem);
}
