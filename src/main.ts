// @ts-ignore
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/+esm';

/**
 * Interface định nghĩa cấu trúc dữ liệu luật
 */
interface LawItem {
  id: string;
  law: 100 | 168;
  article: number;
  clause?: number;
  point?: string;
  vehicle: string[];
  violation: string;
  fine: number;
  pointsDeducted: number;
  delta?: number;
}

/**
 * Class chính quản lý ứng dụng Traffic Coach
 */
class TrafficCoachApp {
  private lawData: LawItem[] = [];
  private fuse: Fuse<LawItem> | null = null;

  constructor() {
    this.init();
  }

  /**
   * Khởi tạo ứng dụng
   */
  private async init(): Promise<void> {
    try {
      await this.loadLawData();
      this.setupSearch();
      this.setupEventListeners();
      console.log('✅ Traffic Coach đã khởi tạo thành công');
    } catch (error) {
      console.error('❌ Lỗi khởi tạo:', error);
    }
  }

  /**
   * Tải dữ liệu luật từ JSON
   */
  private async loadLawData(): Promise<void> {
    try {
      const response = await fetch('/law.json');
      this.lawData = await response.json();
      console.log(`📚 Đã tải ${this.lawData.length} điều khoản luật`);
    } catch (error) {
      console.error('Không thể tải dữ liệu luật:', error);
      // Fallback với dữ liệu mẫu
      this.lawData = this.getSampleData();
    }
  }

  /**
   * Cài đặt fuzzy search với Fuse.js
   */
  private setupSearch(): void {
    const options = {
      keys: ['violation', 'vehicle'],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2
    };
    this.fuse = new Fuse(this.lawData, options);
  }

  /**
   * Populate dropdown phương tiện từ dữ liệu law.json
   */
  private populateVehicleFilter(): void {
    const vehicleFilter = document.getElementById('vehicle-filter') as HTMLSelectElement;
    if (!vehicleFilter || !this.lawData.length) return;

    // Lấy tất cả các loại phương tiện unique
    const vehicleSet = new Set<string>();
    this.lawData.forEach(item => {
      item.vehicle.forEach(v => vehicleSet.add(v));
    });

    // Chuyển thành array và sắp xếp
    const vehicles = Array.from(vehicleSet).sort();

    // Xóa các option cũ (trừ option đầu tiên "Tất cả phương tiện")
    while (vehicleFilter.children.length > 1) {
      vehicleFilter.removeChild(vehicleFilter.lastChild!);
    }

    // Thêm các option mới
    vehicles.forEach(vehicle => {
      const option = document.createElement('option');
      option.value = vehicle;
      option.textContent = vehicle;
      vehicleFilter.appendChild(option);
    });

    console.log(`📋 Đã thêm ${vehicles.length} loại phương tiện vào dropdown`);
  }

  /**
   * Cài đặt event listeners
   */
  private setupEventListeners(): void {
    // Search input
    const searchInput = document.getElementById('q') as HTMLInputElement;
    const vehicleFilter = document.getElementById('vehicle-filter') as HTMLSelectElement;
    
    // Populate vehicle filter từ dữ liệu law.json
    this.populateVehicleFilter();
    
    searchInput?.addEventListener('input', () => this.handleSearch());
    vehicleFilter?.addEventListener('change', () => this.handleSearch());

    // Modal events
    document.getElementById('close-modal')?.addEventListener('click', () => this.closeModal());
    
    // Chat events removed - không cần AI nữa
    // Settings events removed - không cần API keys nữa
  }

  /**
   * Xử lý tìm kiếm
   */
  private handleSearch(): void {
    const query = (document.getElementById('q') as HTMLInputElement)?.value.trim();
    const vehicleFilter = (document.getElementById('vehicle-filter') as HTMLSelectElement)?.value;
    
    if (!query || query.length < 2) {
      this.renderResults([]);
      return;
    }

    let results = this.fuse?.search(query)?.map((result: any) => result.item) || [];
    
    // Filter by vehicle if selected
    if (vehicleFilter) {
      results = results.filter((item: LawItem) => 
        item.vehicle.some((v: string) => v === vehicleFilter)
      );
    }

    this.renderResults(results.slice(0, 20)); // Limit to 20 results
  }

  /**
   * Render kết quả tìm kiếm
   */
  private renderResults(results: LawItem[]): void {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-6 text-center text-gray-500">
          Không tìm thấy kết quả phù hợp
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = results.map(item => this.renderRow(item)).join('');

    // Add click events to rows
    resultsContainer.querySelectorAll('[data-item-id]').forEach(row => {
      row.addEventListener('click', () => {
        const itemId = row.getAttribute('data-item-id');
        const item = results.find(r => r.id === itemId);
        if (item) this.openModal(item);
      });
    });
  }

  /**
   * Render một dòng kết quả
   */
  private renderRow(item: LawItem): string {
    const deltaClass = item.delta ? 
      (item.delta > 0 ? 'text-red-600' : item.delta < 0 ? 'text-green-600' : 'text-yellow-600') 
      : 'text-gray-600';
    
    const deltaText = item.delta ? 
      (item.delta > 0 ? `+${this.formatCurrency(item.delta)}` : 
       item.delta < 0 ? `${this.formatCurrency(item.delta)}` : 'Không đổi') 
      : `(Nghị định ${item.law})`;

    return `
      <div class="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-blue-500" data-item-id="${item.id}">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 mb-1">${item.violation}</h3>
            <div class="text-sm text-gray-600 mb-2">
              <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
                ${item.vehicle.join(', ')}
              </span>
              <span>Điều ${item.article}${item.clause ? `.${item.clause}` : ''}${item.point ? `.${item.point}` : ''}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-semibold text-gray-900">
              ${this.formatCurrency(item.fine)}
            </div>
            <div class="text-sm ${deltaClass}">
              ${deltaText}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Tính Levenshtein distance giữa hai chuỗi
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Khởi tạo matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Tính toán
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[len1][len2];
  }

  /**
   * Tính độ tương đồng giữa hai chuỗi violation (cải thiện với Levenshtein + Jaccard)
   */
  private calculateViolationSimilarity(violation1: string, violation2: string): number {
    // Normalize text
    const normalize = (text: string) => text.toLowerCase()
      .replace(/[^\w\sàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêếềểễệđìíĩỉịòóõỏọôốồổỗộơớờởỡợùúũủụưứừửữựýỳỷỹỵ]/g, '')
      .trim();

    const norm1 = normalize(violation1);
    const norm2 = normalize(violation2);

    // 1. Tính độ tương đồng theo Levenshtein distance
    const maxLen = Math.max(norm1.length, norm2.length);
    const levenDistance = this.levenshteinDistance(norm1, norm2);
    const levenSimilarity = maxLen === 0 ? 1 : (maxLen - levenDistance) / maxLen;

    // 2. Tính độ tương đồng theo từ khóa (Jaccard similarity cải thiện)
    const words1 = norm1.split(/\s+/).filter(word => word.length > 1);
    const words2 = norm2.split(/\s+/).filter(word => word.length > 1);
    
    // Tìm từ tương đồng với ngưỡng chấp nhận
    let matchedWords = 0;
    const used2 = new Set<number>();
    
    for (const word1 of words1) {
      for (let i = 0; i < words2.length; i++) {
        if (used2.has(i)) continue;
        
        const word2 = words2[i];
        // Exact match hoặc very similar (>80% với Levenshtein)
        if (word1 === word2) {
          matchedWords++;
          used2.add(i);
          break;
        } else {
          const wordMaxLen = Math.max(word1.length, word2.length);
          const wordDistance = this.levenshteinDistance(word1, word2);
          const wordSimilarity = wordMaxLen === 0 ? 1 : (wordMaxLen - wordDistance) / wordMaxLen;
          
          if (wordSimilarity >= 0.8) { // 80% tương đồng cho từng từ
            matchedWords++;
            used2.add(i);
            break;
          }
        }
      }
    }
    
    const wordSimilarity = Math.max(words1.length, words2.length) === 0 ? 1 : 
      (matchedWords * 2) / (words1.length + words2.length);

    // 3. Kết hợp với trọng số
    const finalSimilarity = (levenSimilarity * 0.4) + (wordSimilarity * 0.6);
    
    return Math.min(1, finalSimilarity);
  }

  /**
   * Tìm violation tương ứng dựa trên độ tương đồng >= 95%
   */
  private findCorrespondingViolation(item: LawItem): LawItem | null {
    const threshold = 0.6; 
    let bestMatch: LawItem | null = null;
    let bestSimilarity = 0;

    // Tìm trong những violation của nghị định khác
    const otherLawItems = this.lawData.filter(other => other.law !== item.law);
    
    for (const other of otherLawItems) {
      const similarity = this.calculateViolationSimilarity(item.violation, other.violation);
      
      if (similarity >= threshold && similarity > bestSimilarity) {
        bestMatch = other;
        bestSimilarity = similarity;
      }
    }

    return bestMatch;
  }

  /**
   * Mở modal so sánh chi tiết
   */
  private openModal(item: LawItem): void {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) return;

    // Tìm violation tương ứng dựa trên độ tương đồng >= 95%
    const correspondingItem = this.findCorrespondingViolation(item);
    
    // Tính phần trăm tương đồng để hiển thị
    const similarity = correspondingItem ? 
      this.calculateViolationSimilarity(item.violation, correspondingItem.violation) : 0;

    modalContent.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${this.renderLawDetail(item, 'Nghị định ' + item.law)}
        ${correspondingItem ? 
          this.renderLawDetail(correspondingItem, `Nghị định ${correspondingItem.law} (${Math.round(similarity * 100)}% tương đồng)`) :
          '<div class="text-center text-gray-500 p-8">Không tìm thấy quy định tương đồng ≥ 60%</div>'
        }
      </div>
    `;

    modal.classList.remove('hidden');
  }

  /**
   * Render chi tiết một điều luật
   */
  private renderLawDetail(item: LawItem, title: string): string {
    return `
      <div class="border rounded-lg p-6">
        <h4 class="text-xl font-semibold mb-4 text-blue-600">${title}</h4>
        <div class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-600">Điều khoản:</label>
            <p class="text-gray-900">Điều ${item.article}${item.clause ? `.${item.clause}` : ''}${item.point ? `.${item.point}` : ''}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">Đối tượng:</label>
            <p class="text-gray-900">${item.vehicle.join(', ')}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">Vi phạm:</label>
            <p class="text-gray-900">${item.violation}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600">Mức phạt trung bình:</label>
            <p class="text-2xl font-bold text-red-600">${this.formatCurrency(item.fine)}</p>
          </div>
          ${item.pointsDeducted > 0 ? `
            <div>
              <label class="text-sm font-medium text-gray-600">Trừ điểm:</label>
              <p class="text-orange-600 font-medium">${item.pointsDeducted} điểm</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Đóng modal
   */
  private closeModal(): void {
    document.getElementById('modal')?.classList.add('hidden');
  }

  // Settings methods removed - không cần nữa

  /**
   * Format currency
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  /**
   * Dữ liệu mẫu cho trường hợp không tải được từ server
   */
  private getSampleData(): LawItem[] {
    return [
      {
        id: 'ND100-6-1-a',
        law: 100,
        article: 6,
        clause: 1,
        point: 'a',
        vehicle: ['Xe máy'],
        violation: 'Đi ngược chiều đường một chiều',
        fine: 800000,
        pointsDeducted: 2
      },
      {
        id: 'ND168-6-1-a',
        law: 168,
        article: 6,
        clause: 1,
        point: 'a',
        vehicle: ['Xe máy'],
        violation: 'Đi ngược chiều đường một chiều',
        fine: 1200000,
        pointsDeducted: 2,
        delta: 400000
      }
    ];
  }
}

// AIEngine class removed - không cần AI nữa

// Khởi tạo ứng dụng khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new TrafficCoachApp();
}); 