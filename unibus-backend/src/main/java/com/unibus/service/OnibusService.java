@Service
public class OnibusService {

    private final OnibusRepository onibusRepository;

    public OnibusService(OnibusRepository onibusRepository) {
        this.onibusRepository = onibusRepository;
    }

    public List<Onibus> listarTodos() {
        return onibusRepository.findAll();
    }

    public Onibus buscarPorId(Long id) {
        return onibusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ônibus não encontrado"));
    }

    public Onibus criar(Onibus onibus) {
        return onibusRepository.save(onibus);
    }

    public void deletar(Long id) {
        if (!onibusRepository.existsById(id)) {
            throw new RuntimeException("Ônibus não encontrado");
        }

        onibusRepository.deleteById(id);
    }
}