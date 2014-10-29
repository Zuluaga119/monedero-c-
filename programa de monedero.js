/* Programa para controlar dos motores servo MG90s, que comandan un monedero
electrónico el cual diferencia entre tres tipos de moneda en valores de $1.000
$500 y $200, metiendolas en cubiculos diferentes según su peso
MG90s 1-2ms 1.5ms posicion central "0"--2ms > 90º--1ms >-90º: 
real 0.6ms <-90-- 1.3ms > 0º-- 2.6ms> 90º
*/
/*$100   
   690      $500  2246      $1000   
                               2656   TABLAS DE VALORES FLEXIFORCE 200 MUESTREOS
   665            1067         1715
   695            1122         1627
   766            1863         3491
   900            1577         1682
   403            2743         7035
   802            2847         5856
   647            1698         1879
   803            4350         2044
   741            2236         840
   668            1494         2705
   709            2358         937
   666            1223         1742
   593            2205         5056
   711            601          2054
   641            2063         622
   864            1082         3291   
   804            1706         3575   
   707            3008         673   
   623            2835         3275   
                               2663   
   14098<13695    40324>39723        
                               55418>54745     

*/
#include <16F873A.h>
#device adc=10
#FUSES PROTECT,CPD,NOLVP,NOWDT,PUT,HS
#use delay(clock=20000000)
#use rs232(baud=9600, xmit=PIN_C6, rcv=PIN_C7)
#use fast_io (B)
#use fast_io (C)
#DEFINE POWER PIN_C0
#DEFINE SUMINISTRO PIN_C1
#DEFINE CIEN PIN_C3
#DEFINE QUINI PIN_C4
#DEFINE MILES PIN_C5
#DEFINE SERVO1 PIN_B0
#DEFINE SERVO2 PIN_B1
#DEFINE MEDIR PIN_B7
#DEFINE SSQ PIN_A2
#DEFINE  SSM PIN_B3
int16 q;
int16 p;
INT16 a;
int16 i=1000;//1500
unsigned int32 must=0;
int16 arriba=2000;
int16 abajo=1500;
int32 spoint;
int flag=1;
int16 contador=50;
int16 r;
int16 buf;
int16 valciens =14098;
int16 valquini =40324;
int16 valmil = 55418;
int16 resta =0;
int16 valmust=0;
//---------------------------------
 //-----------puerta arriba S2-------------//
   void puerta (void){
 
 for(r=0;r<=contador;r++){
   output_high(SERVO2);
   delay_us(2000); 
   output_low(SERVO2);
   delay_ms(18); 
}
 for(r=0;r<=contador;r++){/* puerta abajo*/
   output_high(SERVO2);
   delay_us(600); 
   output_low(SERVO2);
   delay_ms(19); 
   delay_us(400);
}

 for(r=0;r<=contador;r++){/* canasta al centro S1*/
   output_high(SERVO1);
   delay_us(1500); 
   output_low(SERVO1);
   delay_ms(18);
   delay_us(500);
 }
   
} 
//-----------------------------------
  //-----------moneda a la izquierda S1M---------// 
   void ciens (void){
   
   for(r=0;r<=contador;r++){
   output_high(SERVO1);
   delay_us(2650); 
   output_low(SERVO1);
   delay_ms(17); 
   delay_us(3500);
 }
   
}
//-----------------------------
 //--------moneda a la derecha S1M--------//
  void quinientos (void){
 
 for(r=0;r<=contador;r++){
   output_high(SERVO1);
   delay_us(700); //500
   output_low(SERVO1);
   delay_ms(19);
   delay_us(400);
 }
   
}
//------------------------------  
   void mil (void){
   for(r=0;r<=contador;r++){/* moneda al centro S1*/
   output_high(SERVO1);
   delay_us(1500); //1300
   output_low(SERVO1);
   delay_ms(18);
   delay_us(500);
 }
   
   
}
//---------------------------------  
  
void main() 
{
   output_c(0x00);
   set_tris_c(0x82);
    output_b(0x00);
   set_tris_b(0x88);
   set_tris_a(0x05);
   output_low(POWER);
   setup_adc_ports(AN0);
   //setup_adc_ports(AN0_AN1_AN2_AN4_VSS_VREF);  //para referencia externa
   setup_adc(ADC_CLOCK_INTERNAL);  //Fuente de reloj RC
 
   
/*--------posicion inicial S2P-----------*/ 
//!while(flag==1){
   for(r=0;r<=contador;r++){
   output_high(SERVO2);
   delay_us(600); 
   output_low(SERVO2);
   delay_ms(19); 
   delay_us(400);
  
 }
 /*--------posicion inicial centro S1M-----------*/
   for(r=0;r<=contador;r++){
   output_high(SERVO1);
   delay_us(1500); 
   output_low(SERVO1);
   delay_ms(18);
   delay_us(500);
 }
 delay_ms(200);
 ;************************************************
   set_adc_channel(0); //Habilitación canal0
   delay_us(20);//20
   q = read_adc();//Lectura canal0
   //p = 5.0 * q / 1024.0;  //Conversión a tensión
   must=must+q;
  printf( "\n\r %01.3lu", must);
/*--------------------------------------------------------*/ 
//!WHILE (FLAG==1){
//!   ciens();
//!   puerta();
//!DELAY_MS(500);
//!   mil();
//!    DELAY_MS(500);
//!  quinientos();
//! 
//!}
//!
//!    resta = valciens;
//!    printf( "\n\r %05.1lu", resta);
   
/*--------------------------------------------------------*/
   while (true){
   
   if(!input(MEDIR)){
   must=0;
   buf=0;
   while(!input(MEDIR)){}
   

   delay_ms(1000);
   
   while(must<=0){
   for(a=0;a<=200;a++){
   set_adc_channel(0); //Habilitación canal0
   delay_us(20);//20
   q = read_adc();//Lectura canal0
   //p = 5.0 * q / 1024.0;  //Conversión a tensión
   if(q!=buf){
   must=must+q;
   buf=q;
   }
  }
  must=must/2;
  valmust = must;
}
   
   printf( "\n\r %01.3lu", must);
   //buf=p;
   resta = valciens;  
   resta=resta - must; 
   printf( "\n\r %05.1lu", resta);

   if((resta>=13193)&(resta<=14098)&(input(SSQ))&(input(SSM))){//739
    printf( "\n\r CIEN$");
   ciens();
   puerta();
 }
   resta=valquini;
   resta=resta -must;
   printf( "\n\r %05.1lu", resta);
   if((resta>=35974)&(resta<=40324)&(!input(SSQ))&(INPUT(SSM))){//736
   printf( "\n\r QUINIENTOS$");
  quinientos();
   puerta();
 }
   resta=valmil;
   resta=resta -must;
   printf( "\n\r %05.1lu", resta);
   if((resta>=48383)&(resta<=55418)&(!input(SSM))){//733
   printf( "\n\r MIL$");
   mil();
   puerta();
    
   }
   }
  }
}

