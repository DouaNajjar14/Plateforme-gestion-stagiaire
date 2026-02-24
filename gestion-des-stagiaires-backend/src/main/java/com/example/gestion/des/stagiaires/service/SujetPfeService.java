package com.example.gestion.des.stagiaires.service;

import com.example.gestion.des.stagiaires.dto.SujetPfeRequest;
import com.example.gestion.des.stagiaires.dto.SujetPfeResponse;
import com.example.gestion.des.stagiaires.entity.Departement;
import com.example.gestion.des.stagiaires.entity.SujetPfe;
import com.example.gestion.des.stagiaires.enums.STATUT;
import com.example.gestion.des.stagiaires.repository.DepartementRepository;
import com.example.gestion.des.stagiaires.repository.SujetPfeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SujetPfeService {

    private final SujetPfeRepository sujetPfeRepository;
    private final DepartementRepository departementRepository;

    // US-012 : Créer un sujet PFE — statut OUVERT automatique, date automatique
    public SujetPfeResponse creer(SujetPfeRequest request) {
        Departement departement = departementRepository.findById(request.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département non trouvé avec l'id : " + request.getDepartementId()));

        SujetPfe sujet = SujetPfe.builder()
                .titre(request.getTitre())
                .mission(request.getMission())
                .specialite(request.getSpecialite())
                .competencesRequises(request.getCompetencesRequises())
                .nombreStagiaires(request.getNombreStagiaires())
                .niveauAcademique(request.getNiveauAcademique())
                .statut(STATUT.OUVERT) // Statut OUVERT automatique
                .departement(departement)
                .archive(false)
                .build();

        SujetPfe saved = sujetPfeRepository.save(sujet);
        return toResponse(saved);
    }

    // US-014 : Modifier un sujet PFE — non modifiable si statut POURVUE
    public SujetPfeResponse modifier(UUID id, SujetPfeRequest request) {
        SujetPfe sujet = sujetPfeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet PFE non trouvé avec l'id : " + id));

        if (sujet.getStatut() == STATUT.POURVU) {
            throw new RuntimeException("Impossible de modifier un sujet PFE avec le statut POURVUE");
        }

        Departement departement = departementRepository.findById(request.getDepartementId())
                .orElseThrow(() -> new RuntimeException("Département non trouvé avec l'id : " + request.getDepartementId()));

        sujet.setTitre(request.getTitre());
        sujet.setMission(request.getMission());
        sujet.setSpecialite(request.getSpecialite());
        sujet.setCompetencesRequises(request.getCompetencesRequises());
        sujet.setNombreStagiaires(request.getNombreStagiaires());
        sujet.setNiveauAcademique(request.getNiveauAcademique());
        sujet.setDepartement(departement);

        SujetPfe updated = sujetPfeRepository.save(sujet);
        return toResponse(updated);
    }

    // US-015 : Fermer un sujet PFE — statut FERME
    public SujetPfeResponse fermer(UUID id) {
        SujetPfe sujet = sujetPfeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet PFE non trouvé avec l'id : " + id));

        sujet.setStatut(STATUT.FERME);
        SujetPfe closed = sujetPfeRepository.save(sujet);
        return toResponse(closed);
    }

    // Archiver un sujet PFE
    public SujetPfeResponse archiver(UUID id) {
        SujetPfe sujet = sujetPfeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet PFE non trouvé avec l'id : " + id));

        sujet.setArchive(true);
        SujetPfe archived = sujetPfeRepository.save(sujet);
        return toResponse(archived);
    }

    // Désarchiver un sujet PFE
    public SujetPfeResponse desarchiver(UUID id) {
        SujetPfe sujet = sujetPfeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet PFE non trouvé avec l'id : " + id));

        sujet.setArchive(false);
        SujetPfe unarchived = sujetPfeRepository.save(sujet);
        return toResponse(unarchived);
    }

    // US-013 : Consulter les sujets PFE — avec filtres et pagination
    public Page<SujetPfeResponse> listerActifs(Pageable pageable) {
        return sujetPfeRepository.findByArchiveFalse(pageable)
                .map(this::toResponse);
    }

    public Page<SujetPfeResponse> listerArchives(Pageable pageable) {
        return sujetPfeRepository.findByArchiveTrue(pageable)
                .map(this::toResponse);
    }

    public Page<SujetPfeResponse> listerTous(Pageable pageable) {
        return sujetPfeRepository.findAll(pageable)
                .map(this::toResponse);
    }

    // US-013 : Recherche avec filtres (statut, département, titre) + pagination
    public Page<SujetPfeResponse> rechercher(STATUT statut, UUID departementId, String titre, Pageable pageable) {
        return sujetPfeRepository.rechercher(statut, departementId, titre, pageable)
                .map(this::toResponse);
    }

    public SujetPfeResponse trouverParId(UUID id) {
        SujetPfe sujet = sujetPfeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sujet PFE non trouvé avec l'id : " + id));
        return toResponse(sujet);
    }

    private SujetPfeResponse toResponse(SujetPfe sujet) {
        return SujetPfeResponse.builder()
                .id(sujet.getId())
                .titre(sujet.getTitre())
                .mission(sujet.getMission())
                .specialite(sujet.getSpecialite())
                .competencesRequises(sujet.getCompetencesRequises())
                .nombreStagiaires(sujet.getNombreStagiaires())
                .niveauAcademique(sujet.getNiveauAcademique())
                .statut(sujet.getStatut())
                .archive(sujet.getArchive())
                .departementId(sujet.getDepartement().getId())
                .departementNom(sujet.getDepartement().getNom())
                .dateCreation(sujet.getDateCreation())
                .dateModification(sujet.getDateModification())
                .build();
    }
}

