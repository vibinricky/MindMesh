package com.example.demo.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Repairs databases created by an earlier version that used the singular
 * `knowledge_graph` table name.  The current entity and all graph data use
 * `knowledge_graphs`, so those old foreign keys prevent nodes and edges from
 * being inserted. The migration is idempotent and does not delete data.
 */
@Component
public class LegacyGraphForeignKeyMigration implements ApplicationRunner {

    private final JdbcTemplate jdbc;

    public LegacyGraphForeignKeyMigration(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        repairForeignKey("nodes", "fk_nodes_knowledge_graph");
        repairForeignKey("edges", "fk_edges_knowledge_graph");
    }

    private void repairForeignKey(String tableName, String replacementName) {
        List<Map<String, Object>> foreignKeys = jdbc.queryForList("""
                SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = ?
                  AND COLUMN_NAME = 'knowledge_graph_id'
                  AND REFERENCED_TABLE_NAME IS NOT NULL
                """, tableName);

        for (Map<String, Object> foreignKey : foreignKeys) {
            String referencedTable = (String) foreignKey.get("REFERENCED_TABLE_NAME");
            if ("knowledge_graphs".equalsIgnoreCase(referencedTable)) {
                return;
            }

            String constraintName = (String) foreignKey.get("CONSTRAINT_NAME");
            jdbc.execute("ALTER TABLE `" + tableName + "` DROP FOREIGN KEY `" + constraintName + "`");
            jdbc.execute("ALTER TABLE `" + tableName + "` ADD CONSTRAINT `" + replacementName
                    + "` FOREIGN KEY (`knowledge_graph_id`) REFERENCES `knowledge_graphs` (`id`)");
            return;
        }
    }
}
