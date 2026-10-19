package com.dfs.nodeserver.controllers;
import java.io.IOException;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dfs.nodeserver.services.NodeServerService;
@RestController
@RequestMapping("/chunks")
public class NodeServerController {

    private final NodeServerService service;

    public NodeServerController(NodeServerService service) {
        this.service = service;
    }

    // UPLOAD (octet-stream)
    @PostMapping(consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<String> uploadChunk(
            @RequestBody byte[] data
    ) throws IOException {

        String chunkId = UUID.randomUUID().toString();
        service.save(chunkId, data);

        return ResponseEntity.ok(chunkId);
    }

    // DOWNLOAD
    @GetMapping(
            value = "/{chunkId}",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public ResponseEntity<Resource> download(
            @PathVariable String chunkId
    ) throws IOException {

        Resource resource = service.load(chunkId);
        return ResponseEntity.ok(resource);
    }

    // HEALTH
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
