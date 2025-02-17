>def msgout = dispmsg(tag, con)
## Tags
    alf = "Aluminum Foil" 
    bat = "Battery"
    blp = "Blister Pack"
    bot = "Bottle"
    boc = "Bottle cap"
    brg = "Broken glass"
    can = "Can"
    car = "Carton"
    cig = "Cigarette"
    cup = "Cup"
    fow = "Food waste"
    glj = "Glass jar"
    lid = "Lid"
    otp = "Other plastic"
    pap = "Paper"
    pab = "Paper bag"
    plw = "Plastic bag & wrapper"
    plc = "Plastic container"
    plg = "Plastic gloves"
    plu = "Plastic utensils"
    ptb = "Pop tab"
    rps = "Rope & strings"
    scm = "Scrap metal"
    sho = "Shoe"
    sqt = "Squeezable tube"
    saw = "Straw"
    stp = "Styrofoam piece"
    unl = "Unlabeled litter" 
#
# Inputs
#   tag: the identification tag for the object
#   con: the confidence level of the object
#
# Outputs
#   msgout: the msg to be displayed on the user-interactive display
#
## Initialization
n = size(output)
phra1 = "You have {tag}
phra2 = "
>while con.all > 0.3
>    while con.fow > 0.05
>        if max.con = alf
>            msgout = list(phrase1 
    