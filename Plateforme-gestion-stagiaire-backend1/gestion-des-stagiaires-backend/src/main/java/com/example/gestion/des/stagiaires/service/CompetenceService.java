package com.example.gestion.des.stagiaires.service;

import com.example.gestion.des.stagiaires.dto.CompetenceRequest;
import com.example.gestion.des.stagiaires.dto.CompetenceResponse;
import com.example.gestion.des.stagiaires.entity.Competence;
import com.example.gestion.des.stagiaires.repository.CompetenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompetenceService {

    private final CompetenceRepository competenceRepository;

    public CompetenceResponse creer(CompetenceRequest request) {
        if (competenceRepository.existsByNom(request.getNom())) {
            throw new RuntimeException("Une compétence avec ce nom existe déjà");
        }

        Competence competence = Competence.builder()
                .nom(request.getNom())
                .build();

        Competence saved = competenceRepository.save(competence);
        return toResponse(saved);
    }

    public CompetenceResponse modifier(Long id, CompetenceRequest request) {
        Competence competence = competenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétence non trouvée avec l'id : " + id));

        // Vérifier si le nom est déjà utilisé par une autre compétence
        if (!competence.getNom().equals(request.getNom()) && competenceRepository.existsByNom(request.getNom())) {
            throw new RuntimeException("Une compétence avec ce nom existe déjà");
        }

        competence.setNom(request.getNom());
        Competence updated = competenceRepository.save(competence);
        return toResponse(updated);
    }

    public void supprimer(Long id) {
        if (!competenceRepository.existsById(id)) {
            throw new RuntimeException("Compétence non trouvée avec l'id : " + id);
        }
        competenceRepository.deleteById(id);
    }

    public List<CompetenceResponse> listerToutes() {
        return competenceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CompetenceResponse trouverParId(Long id) {
        Competence competence = competenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compétence non trouvée avec l'id : " + id));
        return toResponse(competence);
    }

    public CompetenceResponse toResponse(Competence competence) {
        return CompetenceResponse.builder()
                .id(competence.getId())
                .nom(competence.getNom())
                .build();
    }
}
