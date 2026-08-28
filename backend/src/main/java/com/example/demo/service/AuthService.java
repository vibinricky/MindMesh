package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.entity.SystemAccount;
import com.example.demo.repository.SystemAccountRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SystemAccountRepository systemAccountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponseDto login(AuthRequestDto authRequestDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequestDto.getUsername(), authRequestDto.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequestDto.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        SystemAccount account = systemAccountRepository.findByUsername(authRequestDto.getUsername()).get();

        return new AuthResponseDto(jwt, account.getUsername(), account.getRole());
    }

    public AuthResponseDto register(RegisterRequestDto request) {
        if (systemAccountRepository.findByUsername(request.username()).isPresent()) throw new IllegalArgumentException("Username is already in use");
        SystemAccount account = new SystemAccount();
        account.setUsername(request.username().trim());
        account.setRole(request.role());
        account.setPasswordHash(passwordEncoder.encode(request.password()));
        account.setStatus("ACTIVE");
        SystemAccount saved = systemAccountRepository.save(account);
        UserDetails details = userDetailsService.loadUserByUsername(saved.getUsername());
        return new AuthResponseDto(jwtUtil.generateToken(details), saved.getUsername(), saved.getRole());
    }

    public SystemAccount getProfile(String username) {
        return systemAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
