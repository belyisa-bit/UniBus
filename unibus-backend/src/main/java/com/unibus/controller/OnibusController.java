@RestController
@RequestMapping("/api/onibus")
public class OnibusController {

    private final OnibusService onibusService;

    public OnibusController(OnibusService onibusService) {
        this.onibusService = onibusService;
    }

    @GetMapping
    public ResponseEntity<List<Onibus>> listarTodos() {
        return ResponseEntity.ok(onibusService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Onibus> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(onibusService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Onibus> criar(@RequestBody Onibus onibus) {
        Onibus novoOnibus = onibusService.criar(onibus);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoOnibus);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        onibusService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}