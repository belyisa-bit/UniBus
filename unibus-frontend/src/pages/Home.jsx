import Card from "../components/Card/Card";
import Button from "../components/Button/Button";

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
    </div>
  );
}

export default Home;