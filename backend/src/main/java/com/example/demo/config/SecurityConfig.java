package com.example.demo.config;

import com.example.demo.repository.SystemAccountRepository;
import com.example.demo.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private SystemAccountRepository systemAccountRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> systemAccountRepository.findByUsername(username)
                .map(account -> org.springframework.security.core.userdetails.User
                        .withUsername(account.getUsername())
                        .password(account.getPasswordHash())
                        .authorities(account.getRole())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/graphs/public", "/api/auth/ping").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/graphs").hasAuthority("ROLE_RESEARCH_STRATEGIST")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/graphs/**").hasAuthority("ROLE_RESEARCH_STRATEGIST")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/graphs/**").hasAuthority("ROLE_RESEARCH_STRATEGIST")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/graphs/*/calculate-complexity").hasAuthority("ROLE_RESEARCH_STRATEGIST")
                .requestMatchers("/api/graphs/activity/all").hasAuthority("ROLE_RESEARCH_STRATEGIST")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
