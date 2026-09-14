import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Badge from "../components/Badge/Badge";

function Home() {
  return (
    <div className="home">
      <h1>Home - UniBus</h1>

      <div className="home-content">
        <Card>
          <h2>Linha Centro</h2>
          <p>Saída às 07:30</p>

          <Badge>Disponível</Badge>

          <Button>
            Ver horários
          </Button>
        </Card>

        <Input
          label="Pesquisar linha"
          placeholder="Digite o nome da linha..."
        />
      </div>
    </div>
  );
}

export default Home;
