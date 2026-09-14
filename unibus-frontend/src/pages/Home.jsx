import Card from "../components/Card/Card";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

function Home() {
  return (
    <div>
      <h1>Home - UniBus</h1>

      <Card>
        <h2>Linha Centro</h2>
        <p>Saída às 07:30</p>

        <Button>
          Ver horários
        </Button>
      </Card>
    <Input
        label="Pesquisar linha"
        placeholder="Digite o nome da linha..."
      />
    </div>
  );
}

export default Home;
