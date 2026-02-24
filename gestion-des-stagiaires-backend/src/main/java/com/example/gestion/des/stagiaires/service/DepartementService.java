package com.example.gestion.des.stagiaires.service;

import com.example.gestion.des.stagiaires.dto.DepartementRequest;
import com.example.gestion.des.stagiaires.dto.DepartementResponse;
import com.example.gestion.des.stagiaires.entity.Departement;
import com.example.gestion.des.stagiaires.repository.DepartementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartementService {

    private final DepartementRepository departementRepository;

    public DepartementResponse creer(DepartementRequest request) {
        if (departementRepository.existsByNomAndArchiveFalse(request.getNom())) {
            throw new RuntimeException("Un département avec ce nom existe déjà");
        }

        Departement departement = Departement.builder()
                .nom(request.getNom())
                .archive(false)
                .build();

        Departement saved = departementRepository.save(departement);
        return toResponse(saved);
    }

    public DepartementResponse modifier(UUID id, DepartementRequest request) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé avec l'id : " + id));

        departement.setNom(request.getNom());
        Departement updated = departementRepository.save(departement);
        return toResponse(updated);
    }

    public DepartementResponse archiver(UUID id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé avec l'id : " + id));

        departement.setArchive(true);
        Departement archived = departementRepository.save(departement);
        return toResponse(archived);
    }

    public DepartementResponse desarchiver(UUID id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé avec l'id : " + id));

        departement.setArchive(false);
        Departement unarchived = departementRepository.save(departement);
        return toResponse(unarchived);
    }

    public List<DepartementResponse> listerActifs() {
        return departementRepository.findByArchiveFalse()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DepartementResponse> listerArchives() {
        return departementRepository.findByArchiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DepartementResponse> listerTous() {
        return departementRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DepartementResponse trouverParId(UUID id) {
        Departement departement = departementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Département non trouvé avec l'id : " + id));
        return toResponse(departement);
    }

    private DepartementResponse toResponse(Departement departement) {
        return DepartementResponse.builder()
                .id(departement.getId())
                .nom(departement.getNom())
                .archive(departement.getArchive())
                .build();
    }
}

