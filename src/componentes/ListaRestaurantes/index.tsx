import axios from "axios";
import { useEffect, useState } from "react";
import { IPaginacao } from "../../interfaces/IPaginacao";
import IRestaurante from "../../interfaces/IRestaurante";
import estilos from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("");

  const carregarDados = (url: string) => {
    axios
      .get<IPaginacao<IRestaurante>>(url)
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  useEffect(() => {
    // obter restaurantes
    carregarDados("http://localhost:8000/api/v1/restaurantes/");
  }, []);

  return (
    <section className={estilos.ListaRestaurantes}>
      <h1>
        Os restaurantes mais <em>bacanas </em>!
      </h1>
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      <div className={estilos.ContainerBotoes}>
        <button
          className={estilos.Botoes}
          onClick={() => carregarDados(paginaAnterior)}
          disabled={!paginaAnterior}>
          Página Anterior
        </button>
        <button
          className={estilos.Botoes}
          onClick={() => carregarDados(proximaPagina)}
          disabled={!proximaPagina}>
          Próxima página
        </button>
      </div>
    </section>
  );
};

export default ListaRestaurantes;
