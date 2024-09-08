from pprint import pprint
import requests
from time import sleep
import json

'''
ayn rand - atlas shrugged - english - 9780451191144 
napolean hill - think and grow rich - english - 9781585424337
james clear - atomic habits - english - 9780734211292
??? - ??? - japanese - 9784797671889
'''


isbns = [
    9780451191144,
    9781585424337,
    9780734211292,
    9784797671889
]

for i in isbns:
    book_link = f"https://openlibrary.org/isbn/{i}.json"
    pprint(book_link)
    try: 
        response = requests.get(book_link)
        JSON = response.json()
        pprint(JSON)
        print('\n\n\n\n')
        sleep(1)
    except json.decoder.JSONDecodeError as error:
        print(error)
        break
   
    
    
