package hol2eih1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;

@Configuration
@EnableWebMvcSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired private CuwyDbService1 cuwyDbService1;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		.csrf().disable()
		.authorizeRequests()
		.antMatchers("/" , "/home" 
				, "/img/**" , "/db/**" , "/css/**" , "/fonts/**" , "/less/**" , "/js/**" , "/hol/**" ).permitAll() .anyRequest()
		.authenticated()
		.and().formLogin().loginPage("/login").permitAll()
		.and().logout().permitAll();
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		cuwyDbService1.setAuthentication(auth);
		/*
		auth.inMemoryAuthentication().withUser("user").password("password").roles("USER");
		auth.inMemoryAuthentication().withUser("re").password("123").roles("dep-22_doc");
		auth.inMemoryAuthentication().withUser("de").password("123").roles("dep-5_doc");
		auth.inMemoryAuthentication().withUser("Вакуленко В.О.").password("Вакуленко В.О.").roles("dep-5_doc");
		 * */
	}
}
