package com.actimatter.backend.repository;

import com.actimatter.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCoordinatorId(Long coordinatorId);
}
