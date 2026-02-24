package com.example.gestion.des.stagiaires.repository;

import com.example.gestion.des.stagiaires.entity.SujetPfe;
import com.example.gestion.des.stagiaires.enums.STATUT;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SujetPfeRepository extends JpaRepository<SujetPfe, UUID> {

    Page<SujetPfe> findByArchiveFalse(Pageable pageable);

    Page<SujetPfe> findByArchiveTrue(Pageable pageable);

    Page<SujetPfe> findByStatutAndArchiveFalse(STATUT statut, Pageable pageable);

    Page<SujetPfe> findByDepartement_IdAndArchiveFalse(UUID departementId, Pageable pageable);

    @Query("SELECT s FROM SujetPfe s WHERE s.archive = false " +
            "AND (:statut IS NULL OR s.statut = :statut) " +
            "AND (:departementId IS NULL OR s.departement.id = :departementId) " +
            "AND (:titre IS NULL OR LOWER(s.titre) LIKE LOWER(CONCAT('%', :titre, '%')))")
    Page<SujetPfe> rechercher(
            @Param("statut") STATUT statut,
            @Param("departementId") UUID departementId,
            @Param("titre") String titre,
            Pageable pageable);
}

