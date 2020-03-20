library(shiny)
library(shinydashboard)
library(shinyjs)
library(dplyr, warn.conflicts = FALSE)
library (leaflet)
library(htmltools)
library (tidyr)

circlesizes<<- c(100,75,50,10,5,4,3,2,1)
restaurants<-read.csv("C:\\Users\\adsmith\\Documents\\GitHub\\SupportColumbusEats\\SCE2.txt", header= FALSE, sep='|')
#restaurants<-read.csv("/srv/shiny-server/SCE/SCE.txt", header= FALSE, sep='|')
colnames(restaurants)<- c("name", "status", "menu", "district", "street", "city", "state", "zipcode", "phnnbr", 
                    "website", "howorder", "delivopt", "pickupopt","phoneord", "phoneorddet", "giftcard", "limmenu", 
                    "lat","lng")
restaurants$lat<-as.numeric(as.character(restaurants$lat))
restaurants$lng<-as.numeric(as.character(restaurants$lng))
#pal <- colorFactor(palette="RdYlGn", restaurants$status, n=3) 
pal <- colorFactor(palette=c("Yellow1", "Green3", "Red3"), restaurants$status, n=3) 

ui <- 
  dashboardPage(skin = "yellow",
                dashboardHeader(title = "Support Columbus Eats", titleWidth = 275),
                #Report Body dataframes and buttons for each page
                dashboardSidebar(width = 10),
                dashboardBody(
                  navbarPage("",id="nav",
                             tabPanel("Map View",
                                      tags$style(type = "text/css", "#map {height: calc(100vh - 80px) !important;}"),
                                      leafletOutput("map"),
                                      absolutePanel(id = "controls", class = "panel panel-default", fixed = TRUE,
                                                    draggable = TRUE, top = 130, left = "auto", right = 30, bottom = "auto",
                                                    width = 230, height = "auto",div(style="padding: 1px; background: #FFFFEE; opacity:0.66")
                                                    
                                                    ,wellPanel(
                                                      h3("Map Explorer"),
                                                      h5("Local restaurants are plotted on the map below"),
                                                      h5("Green/Red coloring indicates restaurant's status (regular/limited hours)"),
                                                      sliderInput("slider1", label = h5("Resize the circles. (More useful as you zoom in/out.)"), 
                                                                  min = 1,max = 100, value = 100),
                                                      #radioButtons("Radio1", "Phone Orders?", choices = c("Yes"="Yes","No"="No"), selected = "Yes" )
                                                    ))),
                             conditionalPanel("false", icon("crosshair"))
                  )
                )
  )


server <- function(input, output, session) {
  
  
  df_map_func <- function(phoneord_chc){
    #restaurants_map <- restaurants[which (restaurants$phoneord==phoneord_chc),]
    restaurants_map<- restaurants
    return(restaurants_map)
  }
  
  
  
  
  output$map <- renderLeaflet({
    restaurants_map <- df_map_func(input$Radio1)
    #restaurants_map<-restaurants
    radiussize=8
    leaflet(restaurants_map)%>%
      addProviderTiles(providers$Esri.WorldTopoMap)  %>%
      fitBounds(-83, 39.8, -82.7, 40.2) %>% #defaults map to OH boundaries
      addCircles( radius = 100*radiussize,
                  fill=TRUE,
                  fillColor=~pal(restaurants_map$status),
                  stroke=TRUE,
                  color="black",
                  weight=1,
                  fillOpacity=.66,
                  popup = paste("Name:", restaurants_map$name, "<br>",
                                "Address:", restaurants_map$street, "<br>",
                                "Status:", restaurants_map$status, "<br>",
                                "Phone Num:", restaurants_map$phnnbr, "<br>"
                  ) 
      )
    
  })
  
  # Incremental changes to the map (in this case, replacing the
  # circles when a new color is chosen) should be performed in
  # an observer. Each independent set of things that can change
  # should be managed in its own observer.
  observe({
    radiussize<-as.numeric(input$slider1)
    restaurants_map <- df_map_func(input$Radio1)
    #restaurants_map<-restaurants
    leafletProxy("map", data = restaurants_map) %>%
      clearShapes() %>%
      addCircles( radius = 8*radiussize,
                  fill=TRUE,
                  fillColor=~pal(restaurants_map$status),
                  stroke=TRUE,
                  color="black",
                  weight=1,
                  fillOpacity=.66,
                  popup = paste("Name:", restaurants_map$name, "<br>",
                                "Address:", restaurants_map$street, "<br>",
                                "Status:", restaurants_map$status, "<br>",
                                "Phone Num:", restaurants_map$phnnbr, "<br>"
                  ) 
      )
  })
}

#Run Shiny App with specified UI and Server
shinyApp(ui, server)