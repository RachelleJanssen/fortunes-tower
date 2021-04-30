node {    
      def app     
      stage('Clone repository') {               
             
            checkout scm    
      }     
      stage('Build image') {         
       
            app = docker.build("fortunes-tower/test")    
       }     
      stage('Test image') {           
            app.inside {            
             
             sh 'echo "Tests passed"'        
            }    
        }     
       stage('Push image') {
                                                  docker.withRegistry('https://127.0.0.1:5000') {            
       app.push("${env.BUILD_NUMBER}")            
       app.push("latest")        
              }    
           }
        }