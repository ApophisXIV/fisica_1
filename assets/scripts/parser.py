from bs4 import BeautifulSoup


def parse_data(html_file):

    soup = BeautifulSoup(file_handle, "html.parser")

    # ----- Description and resource type ---------------------------------
    description = soup.find_all("span", class_="instancename")

    # Delete spaces and new lines
    description = [item.text.strip() for item in description]
    description = [item.replace("\n", "") for item in description]
    description = [item.replace("   ", "") for item in description]
    description = [item.replace("  ", " ") for item in description]
    description = [item.replace("URL", "") for item in description]
    description = description[1:]

    description = [item.split('-') for item in description]
    description_filtered = []
    res_type = []

    for item in description:
        # Check if is empty
        if(len(item) == 1):
            description_filtered.append('COMPLETAR')
            res_type.append('COMPLETAR')
        elif(len(item) == 2):
            description_filtered.append(item[1])
            res_type.append(item[0])
        else:
            description_filtered.append(item[2:])
            res_type.append(item[0])

    description_filtered = [''.join(item) for item in description_filtered]

    # Only capilize first letter of each resource type
    res_type = [item.split(' ')[0].title() for item in res_type]
    # ---------------------------------------------------------------------

    # ----- URL -----------------------------------------------------------
    parent_div = soup.find_all("div", class_="activityinstance")
    parent_div = [item.find_all("a") for item in parent_div]
    urls = [item[0].get("href") for item in parent_div]
    urls = urls[1:]
    # ---------------------------------------------------------------------

    # ----- JSON ----------------------------------------------------------
    """ JSON Template
    {
        "type": "",
        "description": "",
        "url": ""
    }
    """
    json_data = []
    for i in range(len(description_filtered)):
        json_data.append({
            "type": res_type[i],
            "description": description_filtered[i],
            "url": urls[i]
        })

    try:
        with open('out.json', 'w') as outfile:
            outfile.write('[')
            for item in json_data:
                outfile.write(str(item).replace('\'', '\"'))
                # Avoid comma at the end of the list
                if(item != json_data[-1]):
                    outfile.write(',\n')
            outfile.write(']')
            print("Done!")
            print("Total tasks:", len(description_filtered))
    except:
        print("Error writing JSON file")
    # ---------------------------------------------------------------------


try:
    with open(input("Enter file route: ")) as file_handle:
        parse_data(file_handle)
except:
    print("File not found")
