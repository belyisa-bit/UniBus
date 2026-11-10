import { useEffect, useMemo, useRef, useState } from "react"
import { divIcon } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"
import { criarRotaGpsDemo } from "../../data/rotaGpsDemo"
import "leaflet/dist/leaflet.css"
import "./MapaLinhaDemo.css"

const icones = {
  origem: divIcon({ className: "mapa-demo-ponto mapa-demo-embarque", iconSize: [20, 20], iconAnchor: [10, 10] }),
  faculdade: divIcon({ className: "mapa-demo-ponto mapa-demo-faculdade", iconSize: [20, 20], iconAnchor: [10, 10] }),
  onibus: divIcon({
    className: "mapa-demo-onibus",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 10h14M8 19v2M16 19v2"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>',
  }),
}

function AjustarEnquadramento({ percurso, revisao }) {
  const mapa = useMap()

  useEffect(() => {
    const enquadrar = () => {
      mapa.invalidateSize()
      mapa.fitBounds(percurso, { padding: [32, 32], maxZoom: 12, animate: false })
    }
    enquadrar()
    const observer = new ResizeObserver(enquadrar)
    observer.observe(mapa.getContainer())
    return () => observer.disconnect()
  }, [mapa, percurso, revisao])

  return null
}

export default function MapaLinhaDemo({ linha, localizacao }) {
  const rota = useMemo(() => criarRotaGpsDemo(linha), [linha])
  const [passo, setPasso] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [falhaMapa, setFalhaMapa] = useState(false)
  const [revisao, setRevisao] = useState(0)
  const camadaRef = useRef(null)
  const blocosComFalha = useRef(new Set())

  useEffect(() => {
    setPasso(0)
  }, [linha.id])

  useEffect(() => {
    if (pausado || localizacao || !rota) return undefined
    const intervalo = window.setInterval(() => {
      setPasso((atual) => (atual + 1) % rota.percurso.length)
    }, 1000)
    return () => window.clearInterval(intervalo)
  }, [pausado, localizacao, rota])

  useEffect(() => {
    const recarregarMapa = () => camadaRef.current?.redraw()
    window.addEventListener("online", recarregarMapa)
    return () => window.removeEventListener("online", recarregarMapa)
  }, [])

  if (!rota) {
    return <section className="mapa-linha-demo"><p>Mapa demonstrativo indisponível para esta linha.</p></section>
  }

  const posicaoOnibus = localizacao
    ? [Number(localizacao.latitude), Number(localizacao.longitude)]
    : rota.percurso[passo]

  function registrarFalha({ tile }) {
    blocosComFalha.current.add(tile)
    setFalhaMapa(true)
  }

  function removerFalha({ tile }) {
    blocosComFalha.current.delete(tile)
    setFalhaMapa(blocosComFalha.current.size > 0)
  }

  return (
    <section className="mapa-linha-demo" aria-labelledby="mapa-demo-titulo">
      <div className="mapa-demo-heading">
        <h2 id="mapa-demo-titulo">Localização do ônibus</h2>
        <span>{localizacao ? "GPS conectado" : "Simulação demonstrativa"}</span>
      </div>
      <p className="mapa-demo-descricao">
        {localizacao
          ? "O marcador mostra a última posição recebida do GPS. Arraste e use o zoom para explorar o mapa."
          : "O ônibus percorre um trajeto ilustrativo enquanto aguardamos uma leitura GPS. Arraste e use o zoom para explorar o mapa."}
      </p>
      <div className="mapa-demo-controles">
        <ul className="mapa-demo-legenda" aria-label="Legenda do mapa">
          <li><span className="mapa-demo-amostra mapa-demo-embarque" />Origem</li>
          <li><span className="mapa-demo-amostra mapa-demo-faculdade" />Faculdade</li>
          <li>Ônibus: ícone em movimento</li>
        </ul>
        {!localizacao && (
          <button type="button" onClick={() => setPausado((atual) => !atual)}>
            {pausado ? "Retomar simulação" : "Pausar simulação"}
          </button>
        )}
        <button type="button" onClick={() => setRevisao((atual) => atual + 1)}>Ver rota inteira</button>
      </div>
      {falhaMapa && <p role="status" className="mapa-demo-aviso">Não foi possível carregar o mapa de fundo. Verifique sua conexão. Os marcadores e o trajeto continuam visíveis.</p>}
      <div role="region" aria-label={`Mapa interativo da linha ${linha.codigo}`}>
        <MapContainer
          key={linha.id}
          className="mapa-demo-canvas"
          bounds={rota.percurso}
          boundsOptions={{ padding: [30, 30], maxZoom: 12 }}
          scrollWheelZoom
        >
          <AjustarEnquadramento percurso={rota.percurso} revisao={revisao} />
          <TileLayer
            ref={camadaRef}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            eventHandlers={{ tileerror: registrarFalha, tileload: removerFalha, tileunload: removerFalha }}
          />
          <Polyline positions={rota.percurso} pathOptions={{ color: "#0b2c4d", weight: 4, opacity: 0.8 }} />
          {rota.pontos.map((ponto) => (
            <Marker key={ponto.tipo} position={ponto.coordenadas} icon={icones[ponto.tipo]} title={ponto.nome}>
              <Popup>{ponto.tipo === "origem" ? "Origem" : "Faculdade"}: {ponto.nome}</Popup>
            </Marker>
          ))}
          <Marker position={posicaoOnibus} icon={icones.onibus} zIndexOffset={1000} title="Ônibus">
            <Popup>{localizacao ? `GPS atualizado em ${new Date(localizacao.dataHora).toLocaleTimeString("pt-BR")}` : "Ônibus em movimento — simulação demonstrativa"}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  )
}
