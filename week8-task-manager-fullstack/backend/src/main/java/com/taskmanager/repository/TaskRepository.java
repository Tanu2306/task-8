package com.taskmanager.repository;

import com.taskmanager.model.entity.Task;
import com.taskmanager.model.enums.Priority;
import com.taskmanager.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByAssignedToId(Long userId);

    List<Task> findByCreatedById(Long userId);

    @Query("SELECT t FROM Task t WHERE " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:assignedToId IS NULL OR t.assignedTo.id = :assignedToId)")
    List<Task> findByFilters(
        @Param("search") String search,
        @Param("status") TaskStatus status,
        @Param("priority") Priority priority,
        @Param("assignedToId") Long assignedToId
    );

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(@Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :now AND t.status != 'COMPLETED'")
    long countOverdue(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status != 'COMPLETED' AND t.dueDate < :now")
    long countOverdueForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);
}
