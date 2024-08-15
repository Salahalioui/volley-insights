import os

def collect_vue_components(folder_path, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.endswith('.vue'):
                    file_path = os.path.join(root, file)
                    outfile.write(f"\n\n{'='*50}\n")
                    outfile.write(f"File: {file_path}\n")
                    outfile.write(f"{'='*50}\n\n")
                    
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())

# Use raw string notation for the folder path
folder_path = r'C:\Users\SALAH\Desktop\Vue\volley-insights\src\components\StatScreen'

# Specify the output file name
output_file = 'vue_components_collection.txt'

collect_vue_components(folder_path, output_file)
print(f"All Vue components have been collected in {output_file}")