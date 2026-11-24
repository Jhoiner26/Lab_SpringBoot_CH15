package co.cuerpoactivo.cuerpo_activo_api.service;

import co.cuerpoactivo.cuerpo_activo_api.dto.SocioRequest;
import co.cuerpoactivo.cuerpo_activo_api.model.Plan;
import co.cuerpoactivo.cuerpo_activo_api.model.Socio;
import co.cuerpoactivo.cuerpo_activo_api.repository.PlanRepository;
import co.cuerpoactivo.cuerpo_activo_api.repository.SocioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SocioService {

    private final SocioRepository socioRepository;
    private final PlanRepository planRepository;

    public SocioService(SocioRepository socioRepository, PlanRepository planRepository) {
        this.socioRepository = socioRepository;
        this.planRepository = planRepository;
    }

    public List<Socio> listar() {
        return socioRepository.findAll();
    }

    public Optional<Socio> buscarPorId(Long id) {
        return socioRepository.findById(id);
    }

    public Optional<Socio> crear(SocioRequest request) {
        if (request == null || request.nombre() == null || request.nombre().isBlank() || request.planId() == null) {
            throw new IllegalArgumentException("El nombre del socio y el planId son obligatorios");
        }
        Optional<Plan> planOpt = planRepository.findById(request.planId());
        if (planOpt.isEmpty()) {
            return Optional.empty();
        }
        Socio socio = request.aEntidad(planOpt.get());
        socio.setId(null);
        return Optional.of(socioRepository.save(socio));
    }
}
