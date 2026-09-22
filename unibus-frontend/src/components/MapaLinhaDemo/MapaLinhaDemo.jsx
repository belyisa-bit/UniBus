import { useEffect, useRef, useState } from "react"
import { divIcon } from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"
import { rotasGpsDemo } from "../../data/rotasGpsDemo"
import "leaflet/dist/leaflet.css"
import "./MapaLinhaDemo.css"

const icones = {
  embarque: divIcon({ className: "mapa-demo-ponto mapa-demo-embarque", iconSize: [20, 20], iconAnchor: [10, 10] }),
  faculdade: divIcon({ className: "mapa-demo-ponto mapa-demo-faculdade", iconSize: [20, 20], iconAnchor: [10, 10] }),
  onibus: divIcon({
    className: "mapa-demo-onibus",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 10h14M8 19v2M16 19v2"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>',
  }),
}

function EnquadramentoRota({ percurso, revisao }) {
  const mapa = useMap()
  useEffect(() => {
    const enquadrar = () => {
      mapa.invalidateSize()
      mapa.fitBounds(percurso, { padding: [32, 32], maxZoom: 14, animate: false })
    }
    enquadrar()
    const observer = new ResizeObserver(enquadrar)
    observer.observe(mapa.getContainer())
    return () => observer.disconnect()
  }, [mapa, percurso, revisao])
  return null
}

function MapaSimulado({ rota }) {
  const [passo, setPasso] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [falhaMapa, setFalhaMapa] = useState(false)
  const [enquadramento, setEnquadramento] = useState(0)
  const camadaRef = useRef(null)
  const blocosComFalha = useRef(new Set())

  useEffect(() => {
    const recarregarMapa = () => camadaRef.current?.redraw()
    window.addEventListener("online", recarregarMapa)
    return () => window.removeEventListener("online", recarregarMapa)
  }, [])

  function registrarFalha({ tile }) {
    blocosComFalha.current.add(tile)
    setFalhaMapa(true)
  }

  function removerFalha({ tile }) {
    blocosComFalha.current.delete(tile)
    setFalhaMapa(blocosComFalha.current.size > 0)
  }

  useEffect(() => {
    if (pausado) return
    const interval = setInterval(() => {
      setPasso((atual) => (atual + 1) % rota.percurso.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [pausado, rota])

  return (
    <>
      <div className="mapa-demo-controles">
        <ul className="mapa-demo-legenda" aria-label="Legenda do mapa">
          <li><span className="mapa-demo-amostra mapa-demo-embarque" />Origem / embarque</li>
          <li><span className="mapa-demo-amostra mapa-demo-faculdade" />Faculdade</li>
          <li>Ônibus: ícone em movimento</li>
        </ul>
        <button type="button" onClick={() => setPausado((atual) => !atual)}>
          {pausado ? "Retomar simulação" : "Pausar simulação"}
        </button>
        <button type="button" onClick={() => setEnquadramento((atual) => atual + 1)}>
          Ver rota inteira
        </button>
      </div>
      {falhaMapa && <p role="status" className="mapa-demo-aviso">Não foi possível carregar o mapa de fundo. Verifique sua conexão. O traçado e os marcadores continuam demonstrativos.</p>}
      <div role="region" aria-label="Mapa demonstrativo da rota" aria-describedby="mapa-demo-descricao">
        <MapContainer
          className="mapa-demo-canvas"
          bounds={rota.percurso}
          boundsOptions={{ padding: [30, 30], maxZoom: 14 }}
          scrollWheelZoom={false}
        >
          <EnquadramentoRota percurso={rota.percurso} revisao={enquadramento} />
          <TileLayer
            ref={camadaRef}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            eventHandlers={{
              tileerror: registrarFalha,
              tileload: removerFalha,
              tileunload: removerFalha,
            }}
          />
          <Polyline positions={rota.percurso} pathOptions={{ color: "#0b2c4d", weight: 3, opacity: 0.8 }} />
          {rota.pontos.map((ponto, index) => (
            <Marker
              key={`${ponto.tipo}-${index}`}
              position={ponto.coordenadas}
              icon={ponto.tipo === "faculdade" ? icones.faculdade : icones.embarque}
              title={ponto.nome}
              alt={ponto.nome}
            >
              <Popup><strong>{ponto.nome}</strong><br />{ponto.tipo === "faculdade" ? "Faculdade" : ponto.tipo === "embarque" ? "Ponto de embarque" : "Cidade de origem"} — posição aproximada para demonstração.</Popup>
            </Marker>
          ))}
          <Marker position={rota.percurso[passo]} icon={icones.onibus} zIndexOffset={1000} title="Ônibus — posição simulada" alt="Ônibus — posição simulada">
            <Popup>Ônibus em simulação. Não representa GPS real.</Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  )
}

export default function MapaLinhaDemo({ rotaId }) {
  const rota = rotasGpsDemo.find((item) => item.rotaId === rotaId)
  return (
    <section className="mapa-linha-demo" aria-labelledby="mapa-demo-titulo">
      <div className="mapa-demo-heading">
        <h2 id="mapa-demo-titulo">Localização do ônibus</h2>
        <span>Localização demonstrativa</span>
      </div>
      <p id="mapa-demo-descricao" className="mapa-demo-descricao">Posição simulada para demonstração do sistema. Pontos aproximados e traçado ilustrativo; não representa GPS real nem o caminho pelas ruas.</p>
      {rota?.percurso.length > 1
        ? <MapaSimulado key={rotaId} rota={rota} />
        : <p className="mapa-demo-aviso">Mapa demonstrativo ainda não disponível para esta rota.</p>}
    </section>
  )
}
