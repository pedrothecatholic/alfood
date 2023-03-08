import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { IPaginacao } from "../../interfaces/IPaginacao";
import IRestaurante from "../../interfaces/IRestaurante";
import estilos from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";
import { ReactComponent as Search } from "../../assets/search-line.svg";

// esses são os possíveis parâmetros que podemos enviar para a API
interface IParametrosBusca {
  ordering?: string;
  search?: string;
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState("");
  const [paginaAnterior, setPaginaAnterior] = useState("");

  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("");

  // agora, o carregarDados recebe opcionalmente opções de configuração do axios
  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios
      .get<IPaginacao<IRestaurante>>(url, opcoes)
      .then((resposta) => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch((erro) => {
        console.log(erro);
      });
  };

  // a cada busca, montamos um objeto de opções
  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const opcoes = {
      params: {} as IParametrosBusca
    };
    if (busca) {
      opcoes.params.search = busca;
    }
    if (ordenacao) {
      opcoes.params.ordering = ordenacao;
    }
    carregarDados("http://localhost:8000/api/v1/restaurantes/", opcoes);
  };

  useEffect(() => {
    // obter restaurantes
    carregarDados("http://localhost:8000/api/v1/restaurantes/");
  }, []);

  return (
    <section className={estilos.ListaRestaurantes}>
      <form onSubmit={buscar}>
        <div className={estilos.Pesquisa}>
          <input
            className={estilos.BarraPesquisa}
            type="text"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
          <button className={estilos.BotaoPesquisa} type="submit">
            <Search />
          </button>
        </div>
        <div className={estilos.Ordenacao}>
          <label htmlFor="select-ordenacao">Ordenação:</label>
          <div className={estilos.Select}>
            <select
              name="select-ordenacao"
              id="select-ordenacao"
              value={ordenacao}
              onChange={(evento) => setOrdenacao(evento.target.value)}>
              <option value="">Padrão</option>
              <option value="id">Por ID</option>
              <option value="nome">Por Nome</option>
            </select>
            <span className={estilos.Focus}></span>
          </div>
        </div>
      </form>
      {restaurantes?.map((item) => (
        <Restaurante restaurante={item} key={item.id} />
      ))}
      <div className={estilos.ContainerBotoes}>
        {
          <button
            className={estilos.Botoes}
            onClick={() => carregarDados(paginaAnterior)}
            disabled={!paginaAnterior}>
            Página Anterior
          </button>
        }
        {
          <button
            className={estilos.Botoes}
            onClick={() => carregarDados(proximaPagina)}
            disabled={!proximaPagina}>
            Próxima Página
          </button>
        }
      </div>
    </section>
  );
};

export default ListaRestaurantes;
